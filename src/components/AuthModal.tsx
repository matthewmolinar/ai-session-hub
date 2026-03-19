import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import tanagramLogo from "@/assets/tanagram-logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username, display_name: username },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: "Check your email",
          description: "We sent you a confirmation link to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => onOpenChange(false)}>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl px-6 pt-5 pb-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center mb-5">
          <div className="flex items-center gap-2 mb-1">
            <img src={tanagramLogo} alt="Tanagram" className="h-5 w-5" />
            <span className="text-lg font-semibold text-foreground">Tanagram</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {isSignUp ? "Create your account to join" : "Sign in to see what's happening"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          {isSignUp && (
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="h-9 text-sm"
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-9 text-sm"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className="h-9 text-sm"
          />
          <Button type="submit" disabled={loading} className="w-full h-9 text-sm">
            {loading ? "Loading..." : isSignUp ? "Sign up" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-3">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline font-medium"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
