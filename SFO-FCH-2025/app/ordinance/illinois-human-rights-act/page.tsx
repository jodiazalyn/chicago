"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function IllinoisHumanRightsActPage() {
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Illinois Human Rights Act</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">Article 2 - Employment</h2>

            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 mt-8">Sec. 2-103. Arrest record.</h3>
            <p className="ia-text text-gray35 text-base mb-4">
              <strong>(A)</strong> Unless otherwise authorized by law, it is a civil rights violation for any employer, employment agency or labor organization to inquire into or to use an arrest record, as defined under subsection (B-5) of Section 1-103, as a basis to refuse to hire, to segregate, or to act with respect to recruitment, hiring, promotion, renewal of employment, selection for training or apprenticeship, discharge, discipline, tenure or terms, privileges or conditions of employment. This Section does not prohibit a State agency, unit of local government or school district, or private organization from requesting or utilizing sealed felony conviction information obtained from the Illinois State Police under the provisions of Section 3 of the Criminal Identification Act or under other State or federal laws or regulations that require criminal background checks in evaluating the qualifications and character of an employee or a prospective employee.
            </p>
            <p className="ia-text text-gray35 text-base mb-4">
              <strong>(B)</strong> The prohibition against the use of an arrest record, as defined under paragraph (1) of subsection (B-5) of Section 1-103, contained in this Act shall not be construed to prohibit an employer, employment agency, or labor organization from obtaining or using other information which indicates that a person actually engaged in the conduct for which he or she was arrested.
            </p>
            <p className="ia-text text-gray35 text-base mb-4">
              <em>(Source: P.A. 101-565, eff. 1-1-20; 102-538, eff. 8-20-21.)</em>
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 mt-8">Sec. 2-103. Arrest record (continued).</h3>
            <p className="ia-text text-gray35 text-base mb-4">
              <strong>(A)</strong> Unless otherwise authorized by law, it is a civil rights violation for any employer, employment agency or labor organization to inquire into or to use an arrest record, as defined under subsection (B-5) of Section 1-103, as a basis to refuse to hire, to segregate, or to act with respect to recruitment, hiring, promotion, renewal of employment, selection for training or apprenticeship, discharge, discipline, tenure or terms, privileges or conditions of employment. This Section does not prohibit a State agency, unit of local government or school district, or private organization from requesting or utilizing sealed felony conviction information obtained from the Illinois State Police under the provisions of Section 3 of the Criminal Identification Act or under other State or federal laws or regulations that require criminal background checks in evaluating the qualifications and character of an employee or a prospective employee.
            </p>
            <p className="ia-text text-gray35 text-base mb-4">
              <strong>(B)</strong> The prohibition against the use of an arrest record, as defined under paragraph (1) of subsection (B-5) of Section 1-103, contained in this Act shall not be construed to prohibit an employer, employment agency, or labor organization from obtaining or using other information which indicates that a person actually engaged in the conduct for which he or she was arrested.
            </p>
            <p className="ia-text text-gray35 text-base mb-4">
              <em>(Source: P.A. 101-565, eff. 1-1-20; 102-538, eff. 8-20-21.)</em>
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 mt-8">(C) Interactive assessment required for disqualifying conviction.</h3>
            <p className="ia-text text-gray35 text-base mb-4">
              If, after considering the mitigating factors in subsection (B), the employer makes a preliminary decision that the employee's conviction record disqualifies the employee, the employer shall notify the employee of this preliminary decision in writing.
            </p>
            <ol className="list-decimal pl-5 space-y-2 ia-text text-gray35 text-base mb-4">
              <li>
                <strong>Notification.</strong> The notification shall contain all of the following:
                <ul className="list-disc pl-5">
                  <li>(a) notice of the disqualifying conviction or convictions that are the basis for the preliminary decision and the employer's reasoning for the disqualification;</li>
                  <li>(b) a copy of the conviction history report, if any; and</li>
                  <li>(c) an explanation of the employee's right to respond to the notice of the employer's preliminary decision before that decision becomes final. The explanation shall inform the employee that the response may include, but is not limited to, submission of evidence challenging the accuracy of the conviction record that is the basis for the disqualification, or evidence in mitigation, such as rehabilitation.</li>
                </ul>
              </li>
              <li>
                <strong>Employee response.</strong> The employee shall have at least 5 business days to respond to the notification provided to the employee before the employer may make a final decision.
              </li>
              <li>
                <strong>Final decision.</strong> The employer shall consider information submitted by the employee before making a final decision. If an employer makes a final decision to disqualify or take an adverse action solely or in part because of the employee's conviction record, the employer shall notify the employee in writing of the following:
                <ul className="list-disc pl-5">
                  <li>(a) notice of the disqualifying conviction or convictions that are the basis for the final decision and the employer's reasoning for the disqualification;</li>
                  <li>(b) any existing procedure the employer has for the employee to challenge the decision or request reconsideration; and</li>
                  <li>(c) the right to file a charge with the Department.</li>
                </ul>
              </li>
            </ol>
            <p className="ia-text text-gray35 text-base mb-4">
              <em>(Source: P.A. 101-656, eff. 3-23-21.)</em>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
} 