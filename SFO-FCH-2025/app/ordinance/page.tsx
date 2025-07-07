"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrdinancePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background font-poppins p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <Button 
          variant="ghost" 
          className="mb-4 ia-button-outline text-gray35 font-poppins"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="p-8 bg-card text-card-foreground border border-border shadow-sm rounded-lg">
          <div className="max-w-none font-poppins">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Cook County Human Rights Ordinance</h1>
            
            <p className="ia-text mb-6 text-gray35 text-base md:text-lg">
              Employers are required to follow strict rules regarding applicants' and employees' arrest and conviction record(s) and related information.
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 mt-10">CODE OF ORDINANCES OF COOK COUNTY, ILLINOIS</h2>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4">Sec. 42-35. - Employment (H) - Criminal Record or Criminal History</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">(1) General Prohibition</h4>
                <p className="ia-text text-gray35 text-base">
                  Except as otherwise provided in section 42-35(h), no Employer, agent of an Employer or Employment agency shall inquire about, consider, or require disclosure of the criminal record or criminal history of an Employee when considering an application for employment until the Employee has been determined qualified for the position and notified that he or she has been selected for an interview by the Employer or Employment agency or, if there is not an interview, until after a conditional offer of employment is made to the Employee by the Employer or Employment agency.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">(2) Exceptions</h4>
                <p className="ia-text text-gray35 text-base mb-3">
                  The requirements set forth in section 42-35(h)(1) do not apply to:
                </p>
                <ul className="list-disc pl-5 space-y-2 ia-text text-gray35 text-base">
                  <li><strong>a.</strong> Employers that are subject to the Illinois Job Opportunities for Qualified Applicants Act, 820 ILCS 75/1 et seq., or agents of Employers or Employment agencies seeking qualified Employees on behalf of such an Employer;</li>
                  <li><strong>b.</strong> Positions for which a satisfactory criminal background is an established bona fide occupational requirement of a particular position or for a particular group of employees;</li>
                  <li><strong>c.</strong> Positions for which federal or state law requires an Employer to exclude Employees with certain criminal convictions;</li>
                  <li><strong>d.</strong> Positions for which a standard fidelity bond or an equivalent bond is required and an Employee's conviction of one or more specified criminal offenses would disqualify the applicant from obtaining such a bond;</li>
                  <li><strong>e.</strong> Positions for which licensure under the Emergency Medical Services (EMS) Systems Act, 210 ILCS 50/1 et seq. is required.</li>
                  <li><strong>f.</strong> Positions within any municipal law enforcement or investigative agency which requires a criminal background investigation including without limitation the Cook County Sheriff.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">(3) Notification of Disqualifying Offenses</h4>
                <p className="ia-text text-gray35 text-base">
                  The requirements set forth in section 42-35(h)(1) do not prohibit an Employer from notifying Employees in writing of the specific offenses that will disqualify an applicant from employment in a particular position.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">(4) Reserved</h4>
                <p className="ia-text text-gray35 text-base">
                  [Reserved.]
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">(5) Cook County as an Employer</h4>
                <p className="ia-text text-gray35 text-base mb-3">
                  If the County of Cook, subsequent to interviewing or extending a conditional offer of employment to an Employee determines that the Employee has a criminal conviction, that fact alone shall not automatically disqualify the Employee from employment. The Employer, prior to making a decision, should consider the following factors:
                </p>
                <ul className="list-disc pl-5 space-y-2 ia-text text-gray35 text-base">
                  <li><strong>a.</strong> The nature of the Employee's specific offense or offenses;</li>
                  <li><strong>b.</strong> The nature of the Employee's sentencing;</li>
                  <li><strong>c.</strong> The number of the Employee's convictions;</li>
                  <li><strong>d.</strong> The length of time that has passed following the Employee's most recent conviction;</li>
                  <li><strong>e.</strong> The relationship between the Employee's crimes and the nature of the relevant position;</li>
                  <li><strong>f.</strong> The age of the Employee at the time of the most recent conviction;</li>
                  <li><strong>g.</strong> Any evidence of rehabilitation, including, but not limited to, whether the Employee has completed a treatment or counseling program;</li>
                  <li><strong>h.</strong> The extent to which the Employee has been open, honest, and cooperative in the examination of his or her background; and</li>
                  <li><strong>i.</strong> Any other information which the County of Cook deems relevant to the Employee's suitability for the position.</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray35/10 rounded-lg">
              <p className="ia-text text-gray35 text-base">
                <strong>Legal Authority:</strong> (Ord. No. 93-O-13, art. III, 3-16-1993; Ord. No. 02-O-35, art. III, 11-19-2002; Ord. No. 15-3088, 5-20-2015; Ord. No. 15-4214, 7-29-2015; Ord. No. 23-2279.)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}