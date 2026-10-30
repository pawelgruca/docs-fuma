import { ShieldCheck } from 'lucide-react';

const ROLE_SEPARATOR = /,\s*/;

export function Access({ roles }: { roles: string }) {
  const roleList = roles.split(ROLE_SEPARATOR).filter(Boolean);

  return (
    <div className="not-prose access-roles my-4 flex flex-wrap items-center gap-1.5 text-sm">
      <span className="inline-flex items-center gap-1 font-medium text-fd-muted-foreground">
        <ShieldCheck className="size-4" />
        Dostęp:
      </span>
      {roleList.map((role) => (
        <span
          key={role}
          className="rounded-full border border-fd-primary/20 bg-fd-primary/5 px-2 py-0.5 text-xs font-medium text-fd-foreground"
        >
          {role}
        </span>
      ))}
    </div>
  );
}
