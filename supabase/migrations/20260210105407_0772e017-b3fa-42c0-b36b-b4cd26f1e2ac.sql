
-- Role enum
CREATE TYPE public.app_role AS ENUM ('client', 'debugger', 'admin');

-- Bug severity enum
CREATE TYPE public.bug_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Bug urgency enum
CREATE TYPE public.bug_urgency AS ENUM ('normal', 'urgent', 'production_fire');

-- Bug status enum
CREATE TYPE public.bug_status AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'AWAITING_VERIFICATION', 'RESOLVED', 'REOPENED');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Debugger profiles
CREATE TABLE public.debugger_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  bio TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  experience_level TEXT DEFAULT 'mid' CHECK (experience_level IN ('student', 'mid', 'senior')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bugs table
CREATE TABLE public.bugs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  debugger_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT NOT NULL DEFAULT '',
  severity bug_severity NOT NULL DEFAULT 'medium',
  urgency_tier bug_urgency NOT NULL DEFAULT 'normal',
  repo_url TEXT,
  logs TEXT,
  steps_to_reproduce TEXT NOT NULL DEFAULT '',
  access_notes TEXT,
  status bug_status NOT NULL DEFAULT 'OPEN',
  planned_price NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bug messages
CREATE TABLE public.bug_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bug_id UUID REFERENCES public.bugs(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debugger_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bug_messages ENABLE ROW LEVEL SECURITY;

-- Enable realtime for bug_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.bug_messages;

-- Helper function: has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper function: is_bug_participant
CREATE OR REPLACE FUNCTION public.is_bug_participant(_bug_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bugs
    WHERE id = _bug_id AND (client_id = _user_id OR debugger_id = _user_id)
  )
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_debugger_profiles_updated_at BEFORE UPDATE ON public.debugger_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bugs_updated_at BEFORE UPDATE ON public.bugs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email);
  
  -- Auto-assign role from metadata
  IF NEW.raw_user_meta_data->>'role' = 'debugger' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'debugger');
    INSERT INTO public.debugger_profiles (user_id) VALUES (NEW.id);
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies

-- Profiles: authenticated users can read all, users can update own
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- User roles: only admins manage, users can read own
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Debugger profiles: public read for browsing, own write
CREATE POLICY "Anyone can view debugger profiles" ON public.debugger_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Debuggers can update own profile" ON public.debugger_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Debuggers can insert own profile" ON public.debugger_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(), 'debugger'));

-- Bugs: clients see own, debuggers see open + assigned, admins see all
CREATE POLICY "View bugs" ON public.bugs FOR SELECT TO authenticated
  USING (
    client_id = auth.uid() 
    OR debugger_id = auth.uid() 
    OR (status = 'OPEN' AND public.has_role(auth.uid(), 'debugger'))
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Clients create bugs" ON public.bugs FOR INSERT TO authenticated
  WITH CHECK (client_id = auth.uid() AND public.has_role(auth.uid(), 'client'));
CREATE POLICY "Update bugs" ON public.bugs FOR UPDATE TO authenticated
  USING (
    client_id = auth.uid() 
    OR debugger_id = auth.uid() 
    OR public.has_role(auth.uid(), 'admin')
  );

-- Bug messages: only participants
CREATE POLICY "View messages" ON public.bug_messages FOR SELECT TO authenticated
  USING (public.is_bug_participant(bug_id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Send messages" ON public.bug_messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND public.is_bug_participant(bug_id, auth.uid()));
