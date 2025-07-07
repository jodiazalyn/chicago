"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChicagoAmendedOrdinancePage() {
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Chicago Human Rights Ordinance</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">6-10-054 Criminal history</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">(a) Arrest Records</h3>
                <p className="ia-text text-gray35 text-base">
                  Employers shall not inquire into or use arrest record as a basis to refuse to hire, to segregate, or to act with respect to recruitment, hiring, promotion, renewal of employment, selection for training or apprenticeship, discharge, discipline, tenure or terms, privileges, or conditions of employment.
                </p>
                <ul className="list-disc pl-5 space-y-2 ia-text text-gray35 text-base">
                  <li>This subsection (a) does not prohibit a potential employer from requesting or utilizing sealed felony conviction information obtained from the Illinois State Police under the provisions of Section 3 of the Criminal Identification Act or under other State or federal laws or regulations that require criminal background checks in evaluating the qualifications and character of an employee or a prospective employee.</li>
                  <li>The prohibition against the use of an arrest record shall not be construed to prohibit an employer from obtaining or using other information which indicates that a person actually engaged in the conduct for which the individual was arrested.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">(b) Conviction Records</h3>
                <p className="ia-text text-gray35 text-base">
                  Employers shall not use a person’s conviction record as a basis to refuse to hire, to segregate, or to act with respect to recruitment, hiring, promotion, renewal of employment, selection for training or apprenticeship, discharge, discipline, tenure or terms, privileges or conditions of employment, unless:
                </p>
                <ul className="list-disc pl-5 space-y-2 ia-text text-gray35 text-base">
                  <li>applicable law excludes applicants with certain criminal convictions from the relevant position;</li>
                  <li>a standard fidelity bond or an equivalent bond is required for the relevant position, and an applicant's conviction of one or more specified criminal offenses would disqualify the applicant from obtaining such a bond, in which case an employer may include a question or otherwise inquire whether the applicant has ever been convicted of any of those offenses;</li>
                  <li>there is a substantial relationship between one or more of the criminal offenses in the person’s conviction record and the employment sought or held; or</li>
                  <li>the granting or continuation of the employment would involve an unreasonable risk to property or to the safety or welfare of specific individuals or the general public.</li>
                </ul>
                <p className="ia-text text-gray35 text-base mt-2">
                  For the purposes of this subsection (a), "substantial relationship" means a consideration of whether the employment position offers the opportunity for the same or a similar offense to occur and whether the circumstances leading to the conduct for which the person was convicted will recur in the employment position.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">(c) Factors Considered</h3>
                <p className="ia-text text-gray35 text-base">
                  In making a determination pursuant to subsection (a)(3) and (a)(4), the employer shall consider the following factors:
                </p>
                <ul className="list-disc pl-5 space-y-2 ia-text text-gray35 text-base">
                  <li>the length of time since the conviction;</li>
                  <li>the number of convictions that appear on the conviction record;</li>
                  <li>the nature and severity of the conviction and its relationship to the safety and security of others;</li>
                  <li>the facts or circumstances surrounding the conviction;</li>
                  <li>the age of the employee at the time of the conviction; and</li>
                  <li>evidence of rehabilitation efforts.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">(d) Notification and Response</h3>
                <p className="ia-text text-gray35 text-base">
                  In the event any employer makes a preliminary decision that the applicant’s or employee's conviction record disqualifies the applicant or employee, the employer shall notify the applicant or employee of this preliminary decision in writing.
                </p>
                <ol className="list-decimal pl-5 space-y-2 ia-text text-gray35 text-base">
                  <li>
                    <strong>Notification.</strong> The notification shall contain all of the following:
                    <ul className="list-disc pl-5">
                      <li>notice of the disqualifying conviction or convictions or anything else in the conviction record that is the basis for the preliminary decision and the employer's reasoning for the disqualification;</li>
                      <li>a copy of the conviction record, if any; and</li>
                      <li>an explanation of the applicant’s or employee’s right to respond to the notice of the employer’s preliminary decision before that decision becomes final. The explanation shall inform the employee that the response may include, but is not limited to, submission of evidence challenging the accuracy of the conviction record that is the basis for the disqualification, or evidence in mitigation, such as rehabilitation.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Employee response.</strong> The applicant or employee shall have at least 5 business days to respond to the notification provided to the applicant or employee before the employer may make a final decision.
                  </li>
                  <li>
                    <strong>Final decision.</strong> The employer shall consider information submitted by the applicant or employee before making a final decision. If an employer makes a final decision to disqualify or take an adverse action solely or in part because of the applicant’s or employee's conviction record the employer shall notify the applicant or employee in writing of the following:
                    <ul className="list-disc pl-5">
                      <li>notice of the disqualifying conviction or convictions or anything else in the conviction record that is the basis for the final decision and the employer's reasoning for the disqualification;</li>
                      <li>any existing procedure the employer has for the applicant or employee to challenge the decision or request reconsideration; and</li>
                      <li>the right to file a complaint with the Commission.</li>
                    </ul>
                  </li>
                </ol>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 mt-10">6-10-055 Job opportunity advertisements</h2>
                <p className="ia-text text-gray35 text-base">
                  No person shall publish or cause to be published, in print or on the internet, an advertisement for, or other posting of any job opportunity that requires the applicant for the position to be employed or which states any other preference, limitation, or discrimination prohibited by this ordinance. This prohibition does not apply to any third-party publisher of advertisements which is not itself the employer, agent of an employer, employment agency, or labor organization causing publication of the job opportunity.
                </p>
                <p className="ia-text text-gray35 text-base mt-2">
                  (Added Coun J. 3-14-12, p. 22749, § 1)
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 