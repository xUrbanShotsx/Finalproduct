import Link from "next/link";
import {
  Shield,
  Users,
  Settings,
  AlertTriangle,
  CheckSquare,
  Building2,
  BarChart3,
  GraduationCap,
  Map,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ModuleKey, SubModule } from "@/config/modules";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield,
  Users,
  Settings,
  AlertTriangle,
  CheckSquare,
  Building2,
  BarChart3,
  GraduationCap,
  Map,
};

const MODULE_COLORS: Record<ModuleKey, string> = {
  properties: "bg-yellow-50 border-yellow-100 hover:border-yellow-300",
  "aml-ctf":  "bg-red-50 border-red-100 hover:border-red-300",
  policies:   "bg-orange-50 border-orange-100 hover:border-orange-300",
  safety: "bg-red-50 border-red-100 hover:border-red-300",
  people: "bg-blue-50 border-blue-100 hover:border-blue-300",
  operations: "bg-purple-50 border-purple-100 hover:border-purple-300",
  risk: "bg-amber-50 border-amber-100 hover:border-amber-300",
  compliance: "bg-green-50 border-green-100 hover:border-green-300",
  governance: "bg-indigo-50 border-indigo-100 hover:border-indigo-300",
  insights: "bg-cyan-50 border-cyan-100 hover:border-cyan-300",
  training: "bg-violet-50 border-violet-100 hover:border-violet-300",
  blueprints: "bg-teal-50 border-teal-100 hover:border-teal-300",
};

const ICON_COLORS: Record<ModuleKey, string> = {
  properties: "text-yellow-700 bg-yellow-100",
  "aml-ctf":  "text-red-600 bg-red-100",
  policies:   "text-orange-600 bg-orange-100",
  safety: "text-red-600 bg-red-100",
  people: "text-blue-600 bg-blue-100",
  operations: "text-purple-600 bg-purple-100",
  risk: "text-amber-600 bg-amber-100",
  compliance: "text-green-600 bg-green-100",
  governance: "text-indigo-600 bg-indigo-100",
  insights: "text-cyan-600 bg-cyan-100",
  training: "text-violet-600 bg-violet-100",
  blueprints: "text-teal-600 bg-teal-100",
};

interface ModuleCardProps {
  moduleKey: ModuleKey;
  name: string;
  icon: string;
  subModules: SubModule[];
  comingSoon?: boolean;
}

export function ModuleCard({ moduleKey, name, icon, subModules, comingSoon }: ModuleCardProps) {
  const Icon = ICON_MAP[icon] ?? Shield;
  const colorClass = MODULE_COLORS[moduleKey];
  const iconClass = ICON_COLORS[moduleKey];

  const content = (
    <Card
      className={`border-2 transition-all duration-200 ${colorClass} ${
        comingSoon ? "opacity-60" : "cursor-pointer"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          {comingSoon && (
            <Badge variant="secondary" className="text-xs">
              Coming soon
            </Badge>
          )}
        </div>
        <CardTitle className="text-base mt-3">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        {subModules.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {subModules.map((sm) => (
              <span
                key={sm.id}
                className="text-xs px-2 py-0.5 rounded-full bg-white/70 border border-gray-200 text-gray-600"
              >
                {sm.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Submodules are being configured.</p>
        )}
      </CardContent>
    </Card>
  );

  if (comingSoon) return content;

  return <Link href={`/${moduleKey}`}>{content}</Link>;
}
