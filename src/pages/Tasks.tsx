import { useEffect, useState } from "react";
import { Users, TrendingUp, Gift, Copy } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getTelegramUser } from "@/lib/telegram";
import { toast } from "sonner";

const Tasks = () => {
  const [referralCount, setReferralCount] = useState(0);
  const [earnedRewards, setEarnedRewards] = useState(0);
  const [recentReferrals, setRecentReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const telegramUser = getTelegramUser();

  const referralLink = `https://t.me/tonnect_carnival_bot/start?startapp=${telegramUser?.id || ''}`;

  useEffect(() => {
    loadTasksStatus();
  }, []);

  const loadTasksStatus = async () => {
    if (!telegramUser) return;

    // Get referral count and recent referrals
    const { data: referrals, count } = await supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("referred_by", telegramUser.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setReferralCount(count || 0);
    setRecentReferrals(referrals || []);
    
    // Calculate earned rewards (100 TONNECT per referral)
    setEarnedRewards((count || 0) * 100);
    
    setLoading(false);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  if (!telegramUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
          <p className="text-muted-foreground">
            Please open this app through Telegram to access tasks.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 p-6 bg-background">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">📋 Referral Program</h1>
          <p className="text-muted-foreground">Invite friends and earn together</p>
        </div>

        {/* Referral Rewards Info */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Referral Rewards</h3>
          </div>
          
          <div className="space-y-3">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">One-Time Bonus</p>
                  <p className="text-sm text-muted-foreground">Get 100 TONNECT when a friend signs up</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary font-bold">2</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Passive Income</p>
                  <p className="text-sm text-muted-foreground">Earn 5% from all their mining forever</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-foreground mb-4">Your Referral Link</h3>
          
          <div className="flex gap-2 mb-4">
            <div className="flex-1 bg-muted/50 rounded-xl px-4 py-3 text-sm text-muted-foreground overflow-hidden">
              <span className="truncate block">{referralLink}</span>
            </div>
            <Button 
              onClick={copyReferralLink}
              size="icon"
              className="bg-primary hover:bg-primary/90 flex-shrink-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Your Code</p>
            <p className="text-2xl font-bold text-primary">TONNECT-{telegramUser?.id}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-foreground" />
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{referralCount}</p>
            <p className="text-xs text-muted-foreground">Referrals</p>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <p className="text-3xl font-bold text-primary">{referralCount}</p>
            <p className="text-xs text-muted-foreground">Users</p>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Earned</p>
            </div>
            <p className="text-3xl font-bold text-primary">{earnedRewards}</p>
            <p className="text-xs text-muted-foreground">TONNECT</p>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <p className="text-3xl font-bold text-secondary">0</p>
            <p className="text-xs text-muted-foreground">TONNECT</p>
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-foreground mb-4">Recent Referrals</h3>
          
          {recentReferrals.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-1">No referrals yet</p>
              <p className="text-sm text-muted-foreground">Share your referral link to start earning!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReferrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">
                        {referral.username?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{referral.username || 'User'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">+100</p>
                    <p className="text-xs text-muted-foreground">TONNECT</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Tasks;

