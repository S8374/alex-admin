import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail, MapPin, Briefcase } from "lucide-react";
import { TabProps } from "./types";
import { Separator } from "@/components/ui/separator";

export function RepresentativeTab({ user, isLoading = false }: TabProps) {
  if (isLoading) {
    return <RepresentativeSkeleton />;
  }

  // Get all unique representatives from applications
  const representatives = user.applications
    .filter((app: any) => app.representative)
    .map((app: any) => ({
      ...app.representative,
      applicationId: app.id,
    }));

  return (
    <div className="space-y-8">
      {representatives.length > 0 ? (
        representatives.map((rep: any) => (
          <Card key={rep.id} className="rounded-[2.5rem] border-gray-100 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-gray-50/40 border-b border-gray-50 py-6 px-10">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-500 flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-primary" /> Representative Information
                </div>
                <span className="text-[9px] bg-primary/10 text-primary px-3 py-1 rounded-full">
                  App #{rep.applicationId.slice(0, 8)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center shrink-0 border border-primary/10 shadow-sm">
                      <User className="w-7 h-7 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</p>
                      <h3 className="text-xl font-black text-gray-900 leading-none">{rep.fullName}</h3>
                      <p className="text-[11px] font-bold text-primary uppercase tracking-tighter">{rep.relationship}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center shrink-0">
                        <Mail className="w-4.5 h-4.5 text-gray-400" />
                      </div>
                      <div className="space-y-1 pt-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                        <p className="text-sm font-bold text-gray-800">{rep.email || rep.emailAddress || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center shrink-0">
                        <Phone className="w-4.5 h-4.5 text-gray-400" />
                      </div>
                      <div className="space-y-1 pt-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                        <p className="text-sm font-bold text-gray-800">{rep.phoneNumber || rep.cellPhone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin className="w-7 h-7 text-gray-400" />
                    </div>
                    <div className="space-y-4 pt-1 flex-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mailing Address</p>
                      <div className="space-y-2">
                        <p className="text-sm font-black text-gray-800 leading-relaxed">
                          {rep.city || 'N/A'}, {rep.state || 'N/A'} {rep.zipCode || ''}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {rep.workPhone && (
                            <span className="text-[9px] font-black bg-gray-100 px-2 py-1 rounded uppercase tracking-tighter text-gray-500">
                              Work: {rep.workPhone}
                            </span>
                          )}
                          {rep.homePhone && (
                            <span className="text-[9px] font-black bg-gray-100 px-2 py-1 rounded uppercase tracking-tighter text-gray-500">
                              Home: {rep.homePhone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-50" />

                  <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">Role Type</p>
                      <p className="text-sm font-black text-gray-900">Designated Representative</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-gray-200" />
          </div>
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No designated representatives found</p>
          <p className="text-[10px] font-bold text-gray-400 mt-2">Representatives are assigned during the application process.</p>
        </div>
      )}
    </div>
  );
}

function RepresentativeSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-12 rounded-2xl bg-gray-100" />
      <div className="rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden bg-white">
        <div className="bg-gray-50/40 border-b border-gray-50 py-6 px-4 sm:px-10">
          <div className="h-3 w-64 rounded-full bg-gray-200" />
        </div>
        <div className="p-4 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-gray-100" />
                <div className="space-y-3 flex-1">
                  <div className="h-3 w-24 rounded-full bg-gray-100" />
                  <div className="h-6 w-44 rounded-full bg-gray-100" />
                  <div className="h-3 w-28 rounded-full bg-gray-100" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-12 rounded-2xl bg-gray-100" />
                <div className="h-12 rounded-2xl bg-gray-100" />
              </div>
            </div>
            <div className="space-y-8">
              <div className="h-20 rounded-3xl bg-gray-100" />
              <div className="h-px bg-gray-100" />
              <div className="h-20 rounded-3xl bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
