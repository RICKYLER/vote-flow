import { useEffect, useState } from 'react';
import { useAuditLog } from '@/hooks/useElection';
import { formatHashForDisplay } from '@/lib/blockchain';
import { supabase } from '@/integrations/supabase/client';
import { AuditLogEntry } from '@/@types/blockchain';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hash, Clock, Activity } from 'lucide-react';

interface AuditLogPanelProps {
  electionId: string;
}

export function AuditLogPanel({ electionId }: AuditLogPanelProps) {
  const { data: auditLog, refetch } = useAuditLog(electionId);
  const [realtimeEntries, setRealtimeEntries] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    // Subscribe to realtime updates
    const channel = supabase
      .channel('audit-log-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_log',
          filter: `election_id=eq.${electionId}`,
        },
        (payload) => {
          const newEntry = payload.new as AuditLogEntry;
          setRealtimeEntries((prev) => [newEntry, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [electionId]);

  // Combine realtime entries with fetched data
  const allEntries = [...realtimeEntries, ...(auditLog || [])].reduce(
    (acc, entry) => {
      if (!acc.find((e) => e.id === entry.id)) {
        acc.push(entry);
      }
      return acc;
    },
    [] as AuditLogEntry[]
  );

  return (
    <div className="voting-card">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Live Audit Log</h3>
        <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {allEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No activity yet. Votes will appear here in real-time.
            </p>
          ) : (
            allEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-3 bg-muted/30 rounded-lg border border-border/50 animate-fade-in"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded">
                        {entry.action}
                      </span>
                      {entry.position && (
                        <span className="text-xs text-muted-foreground">
                          {entry.position}
                        </span>
                      )}
                    </div>
                    
                    {entry.block_hash && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Hash className="w-3 h-3" />
                        <span className="font-mono">{formatHashForDisplay(entry.block_hash)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                {entry.block_number && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Block #{entry.block_number}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
