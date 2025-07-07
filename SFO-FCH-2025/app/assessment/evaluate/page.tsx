"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, FileText, Info, Send, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image"; // Add this import for the logo

interface Step {
  id: number;
  title: string;
  completed: boolean;
}

interface RequiredDocument {
  type: "jobDescription" | "backgroundCheck" | "restorativeRecord";
  file: File | null;
  notes: string;
}

export default function AssessmentEvaluate() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showBlockingDialog, setShowBlockingDialog] = useState(false);
  const [showCompletionWarning, setShowCompletionWarning] = useState(false);
  const [showComplianceConfirmation, setShowComplianceConfirmation] = useState(false);
  const [showTimeframeDialog, setShowTimeframeDialog] = useState(false);
  const [showFinalDialog, setShowFinalDialog] = useState(false);
  const [complianceAcknowledged, setComplianceAcknowledged] = useState(false);
  const [responseTimeframe, setResponseTimeframe] = useState("");
  const [giveAnotherChance, setGiveAnotherChance] = useState<boolean | null>(null);
  const [showOfferLetterDialog, setShowOfferLetterDialog] = useState(false);
  const [offerLetterData, setOfferLetterData] = useState({
    applicantName: "",
    position: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [showWOTCModal, setShowWOTCModal] = useState(false);
  const [showWOTCSigningScreen, setShowWOTCSigningScreen] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: "Confirm Conditional Offer", completed: false },
    { id: 2, title: "Validate Document Basis", completed: false },
    { id: 3, title: "Direct Job-Relation Inquiry", completed: false },
    { id: 4, title: "Time Elapsed Analysis", completed: false },
    { id: 5, title: "Evidence of Rehabilitation", completed: false },
    { id: 6, title: "Assessment Summary", completed: false },
    { id: 7, title: "Candidate Notification", completed: false },
    { id: 8, title: "Final Decision", completed: false },
  ]);

  const [hasConditionalOffer, setHasConditionalOffer] = useState<string | null>(null);

  const [documentValidation, setDocumentValidation] = useState({
    isOld: false,
    isJuvenile: false,
    isDecriminalized: false,
  });

  const [jobRelation, setJobRelation] = useState({
    isRelated: null as boolean | null,
    duties: [] as string[],
    explanation: "",
  });

  const [timeElapsed, setTimeElapsed] = useState<string>("");

  const [rehabilitation, setRehabilitation] = useState({
    hasEvidence: null as boolean | null,
    notes: "",
  });

  const [certificationChecked, setCertificationChecked] = useState(false);

  const [showNoticeDialog, setShowNoticeDialog] = useState(false);
  const [noticeData, setNoticeData] = useState({
    date: new Date().toISOString().split('T')[0],
    applicantName: "",
    position: "",
    convictions: "",
    assessmentNotes: "",
    timeSinceOffense: "",
    timeSinceSentence: "",
    jobDuties: "",
    fitnessImpact: ""
  });
  const [isEditingNotice, setIsEditingNotice] = useState(false);

  const [showFinalNoticeDialog, setShowFinalNoticeDialog] = useState(false);
  const [finalNoticeData, setFinalNoticeData] = useState({
    date: new Date().toISOString().split('T')[0],
    applicantName: "",
    position: "",
    initialNoticeDate: "",
    receivedResponse: false,
    responseDetails: "",
    convictionError: false,
    convictions: "",
    assessmentNotes: "",
    timeSinceOffense: "",
    timeSinceSentence: "",
    jobDuties: "",
    fitnessImpact: "",
    reconsiderationAllowed: false,
    reconsiderationProcess: ""
  });
  const [isEditingFinalNotice, setIsEditingFinalNotice] = useState(false);

  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [showWOTCCongratsModal, setShowWOTCCongratsModal] = useState(false);

  const [documents, setDocuments] = useState<Record<string, RequiredDocument>>({
    jobDescription: { type: "jobDescription", file: null, notes: "" },
    backgroundCheck: { type: "backgroundCheck", file: null, notes: "" },
    restorativeRecord: { type: "restorativeRecord", file: null, notes: "" },
  });

  useEffect(() => {
    setDocuments({
      jobDescription: {
        type: "jobDescription",
        file: typeof window !== "undefined" ? new File([
          "Sample content for Entry Level Sales Associate Job Description"
        ], "Entry_Level_Sales_Associate_Job_Description.pdf", { type: "application/pdf" }) : null,
        notes: "",
      },
      backgroundCheck: {
        type: "backgroundCheck",
        file: typeof window !== "undefined" ? new File([
          "Sample content for Background Check Summary Jacobi Iverson"
        ], "Background_Check_Summary_Jacobi_Iverson.pdf", { type: "application/pdf" }) : null,
        notes: "",
      },
      restorativeRecord: {
        type: "restorativeRecord",
        file: typeof window !== "undefined" ? new File([
          "Sample content for Jacobi Iverson Restorative Record"
        ], "Jacobi Iverson Restorative Record (0) (1).pdf", { type: "application/pdf" }) : null,
        notes: "",
      },
    });
  }, []);

  const handleStepClick = (stepId: number) => {
    const previousStepsCompleted = steps
      .filter(step => step.id < stepId)
      .every(step => step.completed);

    if (!previousStepsCompleted) {
      toast({
        title: "Cannot Skip Steps",
        description: "Please complete the previous steps before proceeding.",
      });
      return;
    }

    if (stepId > 1 && hasConditionalOffer === "no") {
      setShowBlockingDialog(true);
      return;
    }

    setCurrentStep(stepId);
  };

  const handleNext = () => {
    if (currentStep === 1 && hasConditionalOffer === "no") {
      setShowOfferLetterDialog(true);
      return;
    }

    setSteps(prev => prev.map(step => 
      step.id === currentStep ? { ...step, completed: true } : step
    ));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    setShowCompletionWarning(true);
  };

  const handleComplianceAcknowledge = () => {
    setShowCompletionWarning(false);
    setShowComplianceConfirmation(true);
  };

  const handleComplianceConfirm = () => {
    setShowComplianceConfirmation(false);
    setShowTimeframeDialog(true);
  };

  const handleTimeframeSubmit = () => {
    setShowTimeframeDialog(false);
    setShowFinalDialog(true);
  };

  const handleReturnToDashboard = () => {
    router.push("/");
  };

  const handleSendOfferLetter = () => {
    toast({
      title: "Conditional Offer Letter Sent",
      description: "The letter has been sent to the candidate. Please wait for their acknowledgment before proceeding with the background check.",
    });
    setShowOfferLetterDialog(false);
    setHasConditionalOffer("yes");
  };

  const handleProceedWithHire = () => {
    setShowWOTCModal(true);
  };

  const handleContinueToSigning = () => {
    setShowWOTCModal(false);
    setShowWOTCSigningScreen(true);
  };

  const handleSignAndSend = () => {
    toast({
      title: "Forms Signed and Sent",
      description: "The WOTC forms have been signed and sent for review.",
    });
    setShowWOTCCongratsModal(true);
  };

  const getLegalGuidance = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">SEC. 4904 (c)</h3>
            <p className="text-sm text-muted-foreground">
              The Employer shall not require applicants or potential applicants for employment, or employees, to disclose, and shall not inquire into or discuss, their Conviction History or an Unresolved Arrest until after a conditional offer of employment. The Employer may not itself conduct or obtain from a third party a Background Check until after a conditional offer of employment.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">SEC. 4904 subsections (a)(1)-(7)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The FCO prohibits covered employers from ever considering the following:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• An arrest not leading to a conviction, except for unresolved arrests</li>
              <li>• Participation in a diversion or deferral of judgment program</li>
              <li>• A conviction that has been dismissed, expunged, otherwise invalidated, or inoperative</li>
              <li>• A conviction in the juvenile justice system</li>
              <li>• An offense other than a felony or misdemeanor, such as an infraction</li>
              <li>• A conviction that is more than 7 years old (unless the position being considered supervises minors or dependent adults)</li>
              <li>• A conviction for decriminalized conduct, including the non-commercial use and cultivation of cannabis</li>
            </ul>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Section 4093 Definitions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Directly-Related Conviction in the employment context shall mean that the conduct for which a person was convicted or that is the subject of an Unresolved Arrest has a direct and specific negative bearing on that person's ability to perform the duties or responsibilities necessarily related to the employment position. In determining whether the conviction or Unresolved Arrest is directly related to the employment position, the Employer shall consider whether the employment position offers the opportunity for the same or a similar offense to occur and whether circumstances leading to the conduct for which the person was convicted or that is the subject of an Unresolved Arrest will recur in the employment position.
            </p>
            <h3 className="font-semibold">SEC. 4904 (f)</h3>
            <p className="text-sm text-muted-foreground">
              In making an employment decision based on an applicant's or employee's Conviction History, an Employer shall conduct an individualized assessment, considering only Directly-Related Convictions, the time that has elapsed since the Conviction or Unresolved Arrest, and any evidence of inaccuracy or Evidence of Rehabilitation or Other Mitigating Factors.
            </p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Time Elapsed Restrictions</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The Fair Chance Ordinance (FCO) prohibits covered employers from ever considering the following:
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              A conviction that is more than 7 years old (unless the position being considered supervises minors or dependent adults).
            </p>
            <h3 className="font-semibold">SEC. 4904. (5)</h3>
            <p className="text-sm text-muted-foreground">
              A Conviction that is more than seven years old, the date of Conviction being the date of sentencing, except that this restriction and any limitations imposed in this Article 49 based on the limitation in this subsection (a)(5) shall not apply where the applicant or employee is or will be (A) providing services to or have supervisory or disciplinary authority over a minor, (B) providing services to or have supervisory or disciplinary authority over a "dependent adult," as that phrase is defined in Illinois Adult Protective Services Act or any successor state law, or (C) providing support services or care to or has supervisory authority over a person 65 years or older;
            </p>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">SEC. 4903. DEFINITIONS</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Rehabilitation Evidence</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Satisfactory compliance with parole/probation terms</li>
                  <li>• Post-conviction employer recommendations</li>
                  <li>• Educational achievements or vocational training</li>
                  <li>• Completion of/participation in rehabilitative treatment</li>
                  <li>• Letters of recommendation from qualified observers</li>
                  <li>• Age at time of conviction</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Voluntary Mitigating Factors</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Coercive conditions preceding offense</li>
                  <li>• History of intimate physical/emotional abuse</li>
                  <li>• Untreated substance abuse</li>
                  <li>• Untreated mental illness</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">SEC. 4904 (h)</h3>
            <p className="text-sm text-muted-foreground">
              If, within seven days of the date that the notice described in subsection (g) is provided by the Employer to the applicant or employee, the applicant or employee gives the Employer notice, orally or in writing, of evidence of the inaccuracy of the item or items of Conviction History or any Evidence of Rehabilitation or Other Mitigating Factors, the Employer shall delay any Adverse Action for a reasonable period after receipt of the information and during that time shall reconsider the prospective Adverse Action in light of the information.
            </p>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">SEC. 4910. EMPLOYER RECORDS</h3>
            <p className="text-sm text-muted-foreground">
              (a) An Employer shall retain records of employment, application forms, and other pertinent data and records required under this Article, for a period of three years, and shall allow the OLSE access to such records, with appropriate notice and at a mutually agreeable time, to monitor compliance with the requirements of this Article.
            </p>
            <p className="text-sm text-muted-foreground">
              (d) Where an Employer does not maintain or retain adequate records documenting compliance with this Article or does not allow the OLSE reasonable access to such records, it shall be presumed that the Employer did not comply with this Article, absent clear and convincing evidence otherwise.
            </p>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">SEC. 4904 (f), (g), (i)</h3>
            <p className="text-sm text-muted-foreground">
              In making an employment decision based on an applicant's or employee's Conviction History, an Employer shall conduct an individualized assessment, considering only Directly-Related Convictions, the time that has elapsed since the Conviction or Unresolved Arrest, and any evidence of inaccuracy or Evidence of Rehabilitation or Other Mitigating Factors.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              If an Employer intends to base an Adverse Action on an item or items in the applicant or employee's Conviction History, prior to taking any Adverse Action the Employer shall provide the applicant or employee with a copy of the Background Check Report, if any, and shall notify the applicant or employee of the prospective Adverse Action and the items forming the basis for the prospective Adverse Action.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Upon taking any final Adverse Action based upon the Conviction History of an applicant or employee, an Employer shall notify the applicant or employee of the final Adverse Action.
            </p>
          </div>
        );
      default:
        return (
          <div className="text-sm text-muted-foreground">
            Select a step to view relevant legal guidance.
          </div>
        );
    }
  };

  const getCompanyPolicy = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Internal policy requires documented confirmation of conditional offer before accessing any conviction history information.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Company guidelines for evaluating conviction history emphasize consideration of only legally permissible information that directly relates to job duties.
            </p>
          </div>
        );
        case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Invite and log mitigating materials during the ≥ 7‑business‑day pre‑adverse window: certificates, sobriety proof, references, completion of supervision, education, NA/AA letters. Weight evidence in line with EEOC factors (training, job history, character refs).
            </p>
          </div>
        );
        case 6:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
            Pursuant to the Cook County Human Rights Ordinance, we consider for employment qualified applicants with arrest and conviction records.
            </p>
          </div>
        );
        case 7:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
            Before taking adverse action such as failing/refusing to hire, discharging, or not promoting an individual based on a conviction history or unresolved arrest, we give the candidate an opportunity to present evidence that the information is inaccurate, that they have been rehabilitated, or other mitigating factors.
            </p>
          </div>
        );
        case 8:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
            We are committed to fair hiring practices and fully adheres to the requirements set forth by the Cook County Commission on Human Rights under the Human Rights Ordinance. This includes providing applicants with automated notice of their right to file a complaint with the Commission if they believe we are not in compliance with the law.
            </p>
          </div>
        );
        case 4:
          return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Record date of conviction and completion of sentence; calculate years elapsed. Highlight whether ≥ 7 yrs have passed (FCO safe‑harbor unless role supervises minors/dependent adults).
            </p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If a candidate's background check reveals a criminal history, we use guidance from the Equal Employment Opportunity Commission (EEOC) recommendations based on the Green Factors, also called the "nature-time-nature" test, which considers:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
              <li>The nature and gravity of the offense</li>
              <li>The time elapsed since the offense</li>
              <li>The nature of the job being sought</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              The outcome of the nature-time-nature test is to determine if the offense and surrounding circumstances are so correlated as to negatively impact the candidate's ability to perform the specific role. If the candidate's past criminal history has no strong correlation to the role or our organization, then we may consider moving forward in the hiring process.
            </p>
          </div>
        );
      default:
        return (
          <div className="text-sm text-muted-foreground">
            Select a step to view relevant company policies.
          </div>
        );
    }
  };

  const getCandidateContext = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Candidate received conditional offer on May 5, 2025.
            </p>
          </div>
        );
        case 7:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Candidate will receive notice of decision and can be contacted via conversational agent or messaging through the secure Restorative Record platform.
            </p>
          </div>
        );
        case 6:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Candidate's initial Restorative Record can be accessed at: 
              <a href="https://cornell.restorativerecord.com/restorative-record/98ab893c-2377-4f3b-9ee2-8fd898da22c4" target="_blank" rel="noopener noreferrer">https://cornell.restorativerecord.com/restorative-record/98ab893c-2377-4f3b-9ee2-8fd898da22c4</a>
            </p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Job Duties & Responsibilities</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Prospect and qualify leads through cold calls, email outreach, and inbound inquiries</li>
              <li>• Conduct virtual or in-person product demonstrations and communicate clear value propositions</li>
              <li>• Log all interactions and sales activities in the company's CRM platform, ensuring accurate and up-to-date
              pipeline data</li>
              <li>• Collaborate cross-functionally with marketing and customer success to support a cohesive customer journey</li>
            </ul>
          </div>
        );
        case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Nature & Circumstances of the Offense</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Offense: Possession with Intent to Sell a Controlled Substance (Class B felony)</li>
              <li>• Jurisdiction & Disposition: Kings County, NY; convicted 12 May 2018; indeterminate 1–9 year sentence</li>
              <li>• Custody Period: Served 4 years in state prison (Jun 2019 – Jun 2023)</li>
              <li>• Supervision: Paroled Jun 2023; completed all parole obligations May 2025</li>
              <li>• Conduct on Supervision: One curfew violation (Sep 2023) resulted in a formal warning; no sanctions or subsequent incidents</li>
            </ul>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Time Elapsed Since Offense & Completion of Sentence</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Conviction Date to Present: ~ 7 years (86 months)</li>
              <li>• Release to Present: ~ 23 months</li>
              <li>• Completion of Supervision to Present: &lt; 1 month (fully resolved)</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              The substantial passage of time and successful completion of supervision signal reduced recidivism risk under established criminogenic‑need models.
            </p>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Evidence of Rehabilitation & Good Conduct</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Recovery & Support</h4>
                <p className="text-sm text-muted-foreground">
                  • 18‑month verified sobriety; Narcotics Anonymous sponsor support
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Education</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• GED with honors</li>
                  <li>• A.A.S., Business Administration – Borough of Manhattan CC (CUNY)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Industry Credentials</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• OSHA 10‑Hour General Industry (Mar 2020)</li>
                  <li>• NY Dept. of Public Health – Food Handler Certificate (valid through Apr 2023)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Professional Development</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Self‑taught data analysis (Excel, SQL basics)</li>
                  <li>• Project management coursework</li>
                  <li>• Bilingual (English/Spanish)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Community Service</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Reentry Coordinator, Osborne Association – founded 20‑student mentorship program for children of incarcerated parents</li>
                  <li>• Facilitator of restorative‑justice circles inside custody</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-sm text-muted-foreground">
            The candidate holds a Certificate of Rehabilitation—a court-issued order affirming that an individual convicted of a felony and previously incarcerated in state or local prison has demonstrated rehabilitation under the law.
          </div>
        );
    }
  };

  const renderOfferLetterContent = () => {
    return (
      <div className="space-y-6 max-h-[60vh] overflow-y-auto">
        <div className={!isEditingLetter ? "space-y-4" : "hidden"}>
          <p>Date: {offerLetterData.date}</p>
          <p>RE: Conditional Offer of Employment & Notice of Conviction Background Check</p>
          <p>Dear {offerLetterData.applicantName || "[APPLICANT NAME]"}:</p>
          <p>
            We are writing to make you a conditional offer of employment for the position of {offerLetterData.position || "[INSERT POSITION]"}. 
            Before this job offer becomes final, we will check your conviction history. The form attached to this letter asks for your permission 
            to check your conviction history and provides more information about that background check.
          </p>
          <p>After reviewing your conviction history report, we will either:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Notify you that this conditional job offer has become final; or</li>
            <li>Notify you in writing that we intend to revoke (take back) this job offer because of your conviction history.</li>
          </ul>
          <p>
            Under Cook County law, employers cannot ask about or use the following criminal records in hiring decisions:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Arrests that did not lead to a conviction</li>
            <li>Juvenile records</li>
            <li>Sealed or expunged convictions</li>
            <li>Old convictions unrelated to the job</li>
          </ul>
          <p>
            As required by the Cook County Human Rights Ordinance, we will consider whether your conviction history is directly related 
            to the duties of the job we have offered you. Before making any final decision, we will consider all of the following:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The nature of your specific offense or offenses</li>
            <li>The nature of your sentencing</li>
            <li>The number of your convictions</li>
            <li>The length of time that has passed since your most recent conviction</li>
            <li>The relationship between your crimes and the nature of the relevant position</li>
            <li>Your age at the time of the most recent conviction</li>
            <li>Any evidence of rehabilitation, including, but not limited to, whether you have completed a treatment or counseling program</li>
            <li>The extent to which you have been open, honest, and cooperative in the examination of your background</li>
            <li>Any other information which the County of Cook deems relevant to your suitability for the position</li>
          </ul>
          <p>
            We will notify you in writing if we plan to revoke (take back) this job offer after reviewing your conviction history. 
            That decision will be preliminary, and you will have an opportunity to respond before it becomes final.
          </p>
          <p>
            We will identify conviction(s) that concern us, give you a copy of the background check report, and allow you at least 
            5 business days to respond with information showing the conviction history report is inaccurate and/or with information 
            about your rehabilitation or mitigating circumstances.
          </p>
          <p>
            We will review any information you timely submit and then decide whether to finalize or take back this conditional job offer. 
            We will notify you of that decision in writing.
          </p>
        </div>

        <div className={isEditingLetter ? "space-y-4" : "hidden"}>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={offerLetterData.date}
              onChange={(e) => setOfferLetterData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="applicantName">Applicant Name</Label>
            <Input
              id="applicantName"
              value={offerLetterData.applicantName}
              onChange={(e) => setOfferLetterData(prev => ({ ...prev, applicantName: e.target.value }))}
              placeholder="Enter applicant name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={offerLetterData.position}
              onChange={(e) => setOfferLetterData(prev => ({ ...prev, position: e.target.value }))}
              placeholder="Enter position title"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderNoticeContent = () => {
    return (
      <div className="space-y-6 max-h-[60vh] overflow-y-auto">
        <div className={!isEditingNotice ? "space-y-4" : "hidden"}>
          <p>[{noticeData.date}]</p>
          <p>Re: Preliminary Decision to Revoke Job Offer Because of Conviction History</p>
          <p>Dear {noticeData.applicantName || "[APPLICANT NAME]"}:</p>
          <p>
            After reviewing the results of your conviction history background check, we have made a preliminary
            (non-final) decision to revoke (take back) our previous job offer for the position of {noticeData.position || "[INSERT POSITION]"} 
            because of the following conviction(s):
          </p>
          <p>{noticeData.convictions || "[LIST CONVICTION(S) THAT LED TO DECISION TO REVOKE OFFER]"}</p>
          
          <p>Our Individualized Assessment:</p>
          <p>
            We have individually assessed whether your conviction history is directly related to the duties of the
            job we offered you. We considered the following:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              The nature and seriousness of the conduct that led to your conviction(s), which we assessed
              as follows: {noticeData.assessmentNotes || "[DESCRIBE WHY CONSIDERED SERIOUS]"}
            </li>
            <li>
              How long ago the conduct occurred that led to your conviction, which was: {noticeData.timeSinceOffense || "[INSERT AMOUNT OF TIME PASSED]"} 
              and how long ago you completed your sentence, which was: {noticeData.timeSinceSentence || "[INSERT AMOUNT OF TIME PASSED]"}.
            </li>
            <li>
              The specific duties and responsibilities of the position of {noticeData.position || "[INSERT POSITION]"},
              which are: {noticeData.jobDuties || "[LIST JOB DUTIES]"}
            </li>
          </ol>
          
          <p>
            We believe your conviction record lessens your fitness/ability to perform the job duties because:
            {noticeData.fitnessImpact}
          </p>
        </div>

        <div className={isEditingNotice ? "space-y-4" : "hidden"}>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={noticeData.date}
              onChange={(e) => setNoticeData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="applicantName">Applicant Name</Label>
            <Input
              id="applicantName"
              value={noticeData.applicantName}
              onChange={(e) => setNoticeData(prev => ({ ...prev, applicantName: e.target.value }))}
              placeholder="Enter applicant name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={noticeData.position}
              onChange={(e) => setNoticeData(prev => ({ ...prev, position: e.target.value }))}
              placeholder="Enter position title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="convictions">Convictions</Label>
            <Textarea
              id="convictions"
              value={noticeData.convictions}
              onChange={(e) => setNoticeData(prev => ({ ...prev, convictions: e.target.value }))}
              placeholder="List convictions that led to decision"
            />
          </div>
          <div className="space-y-2">
            
            <Label htmlFor="assessmentNotes">Assessment Notes</Label>
            <Textarea
              id="assessmentNotes"
              value={noticeData.assessmentNotes}
              onChange={(e) => setNoticeData(prev => ({ ...prev, assessmentNotes: e.target.value }))}
              placeholder="Describe why the convictions are considered serious"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeSinceOffense">Time Since Offense</Label>
            <Input
              id="timeSinceOffense"
              value={noticeData.timeSinceOffense}
              onChange={(e) => setNoticeData(prev => ({ ...prev, timeSinceOffense: e.target.value }))}
              placeholder="Enter time since offense"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeSinceSentence">Time Since Sentence Completion</Label>
            <Input
              id="timeSinceSentence"
              value={noticeData.timeSinceSentence}
              onChange={(e) => setNoticeData(prev => ({ ...prev, timeSinceSentence: e.target.value }))}
              placeholder="Enter time since sentence completion"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobDuties">Job Duties</Label>
            <Textarea
              id="jobDuties"
              value={noticeData.jobDuties}
              onChange={(e) => setNoticeData(prev => ({ ...prev, jobDuties: e.target.value }))}
              placeholder="List relevant job duties"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fitnessImpact">Impact on Job Fitness</Label>
            <Textarea
              id="fitnessImpact"
              value={noticeData.fitnessImpact}
              onChange={(e) => setNoticeData(prev => ({ ...prev, fitnessImpact: e.target.value }))}
              placeholder="Explain how the conviction impacts job fitness"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderFinalNoticeContent = () => {
    return (
      <div className="space-y-6 max-h-[60vh] overflow-y-auto">
        <div className={!isEditingFinalNotice ? "space-y-4" : "hidden"}>
          <p>[{finalNoticeData.date}]</p>
          <p>Re: Final Decision to Revoke Job Offer Because of Conviction History</p>
          <p>Dear {finalNoticeData.applicantName || "[APPLICANT NAME]"}:</p>
          <p>
            We are following up about our letter dated {finalNoticeData.initialNoticeDate || "[DATE OF NOTICE]"} which notified you of our initial
            decision to revoke (take back) the conditional job offer:
          </p>
          
          <div className="space-y-2">
            <p>{finalNoticeData.receivedResponse ? 
              `We made a final decision to revoke the job offer after considering the information you submitted, which included: ${finalNoticeData.responseDetails}` :
              "We did not receive a timely response from you after sending you that letter, and our decision to revoke the job offer is now final."
            }</p>
          </div>

          <p>
            After reviewing the information you submitted, we have determined that there 
            {finalNoticeData.convictionError ? " was " : " was not "} an error on your conviction history report. 
            We have decided to revoke our job offer because of the following conviction(s):
          </p>
          
          <p>{finalNoticeData.convictions || "[LIST CONVICTION(S) THAT LED TO DECISION TO REVOKE OFFER]"}</p>
          
          <div className="space-y-4">
            <p className="font-semibold">Our Individualized Assessment:</p>
            <p>
              We have individually assessed whether your conviction history is directly related to the duties of the
              job we offered you. We considered the following:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                The nature and seriousness of the conduct that led to your conviction(s), which we assessed
                as follows: {finalNoticeData.assessmentNotes || "[DESCRIBE WHY CONSIDERED SERIOUS]"}
              </li>
              <li>
                How long ago the conduct occurred that led to your conviction, which was: {finalNoticeData.timeSinceOffense || "[INSERT AMOUNT OF TIME PASSED]"} 
                and how long ago you completed your sentence, which was: {finalNoticeData.timeSinceSentence || "[INSERT AMOUNT OF TIME PASSED]"}.
              </li>
              <li>
                The specific duties and responsibilities of the position of {finalNoticeData.position || "[INSERT POSITION]"},
                which are: {finalNoticeData.jobDuties || "[LIST JOB DUTIES]"}
              </li>
            </ol>
            
            <p>
              We believe your conviction record lessens your fitness/ability to perform the job duties and have
              made a final decision to revoke the job offer because: {finalNoticeData.fitnessImpact}
            </p>
          </div>

          <div className="space-y-4">
            <p className="font-semibold">Request for Reconsideration:</p>
            {finalNoticeData.reconsiderationAllowed ? (
              <>
                <p>If you would like to challenge this decision or request reconsideration, you may:</p>
                <p>{finalNoticeData.reconsiderationProcess}</p>
              </>
            ) : (
              <p>We do not offer any way to challenge this decision or request reconsideration.</p>
            )}
          </div>

          <div className="space-y-4">
            <p className="font-semibold">Your Right to File a Complaint:</p>
            <p>
              If you believe your rights under the Cook County Human Rights Ordinance have been violated during this job
              application process, you have the right to file a complaint with the Cook County Commission on Human Rights.
            </p>
            <p>There are several ways to file a complaint:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>File a complaint online at: www.cookcountyil.gov/agency/commission-human-rights</li>
              <li>
                Download an intake form at: https://ccchr.my.salesforce-sites.com/Forms/advpm__IntakeForm?formId=a0m8z000000SsC4AAK&formWidth=800px&hh=1 
              </li>
              <li>
                Visit the Cook County Commission on Human Rights office. For office locations: www.cookcountyil.gov/agency/commission-human-rights
              </li>
            </ul>
            <p>
              For more information, visit www.cookcountyil.gov/agency/commission-human-rights or call (312) 603-1100.
            </p>
          </div>
        </div>

        <div className={isEditingFinalNotice ? "space-y-4" : "hidden"}>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={finalNoticeData.date}
              onChange={(e) => setFinalNoticeData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="applicantName">Applicant Name</Label>
            <Input
              id="applicantName"
              value={finalNoticeData.applicantName}
              onChange={(e) => setFinalNoticeData(prev => ({ ...prev, applicantName: e.target.value }))}
              placeholder="Enter applicant name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={finalNoticeData.position}
              onChange={(e) => setFinalNoticeData(prev => ({ ...prev, position: e.target.value }))}
              placeholder="Enter position title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="initialNoticeDate">Initial Notice Date</Label>
            <Input
              id="initialNoticeDate"
              type="date"
              value={finalNoticeData.initialNoticeDate}
              onChange={(e) => setFinalNoticeData(prev => ({ ...prev, initialNoticeDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={finalNoticeData.receivedResponse}
                onCheckedChange={(checked) => 
                  setFinalNoticeData(prev => ({ ...prev, receivedResponse: checked as boolean }))
                }
                className="h-5 w-5 border-2 border-gray-300 bg-white data-[state=checked]:bg-white data-[state=checked]:border-green-500 data-[state=checked]:text-green-500 focus:ring-green-500 transition"
              />
              Received response from candidate
            </Label>
          </div>
          {finalNoticeData.receivedResponse && (
            <div className="space-y-2">
              <Label htmlFor="responseDetails">Response Details</Label>
              <Textarea
                id="responseDetails"
                value={finalNoticeData.responseDetails}
                onChange={(e) => setFinalNoticeData(prev => ({ ...prev, responseDetails: e.target.value }))}
                placeholder="Enter details of candidate's response"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={finalNoticeData.convictionError}
                onCheckedChange={(checked) => 
                  setFinalNoticeData(prev => ({ ...prev, convictionError: checked as boolean }))
                }
                className="h-5 w-5 border-2 border-gray-300 bg-white data-[state=checked]:bg-white data-[state=checked]:border-green-500 data-[state=checked]:text-green-500 focus:ring-green-500 transition"
              />
              Error found in conviction history report
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="convictions">Convictions</Label>
            <Textarea
              id="convictions"
              value={finalNoticeData.convictions}
              onChange={(e) => setFinalNoticeData(prev => ({ ...prev, convictions: e.target.value }))}
              placeholder="List convictions that led to decision"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assessmentNotes">Assessment Notes</Label>
            <Textarea
              id="assessmentNotes"
              value={finalNoticeData.assessmentNotes}
              onChange={(e) => setFinalNoticeData(prev => ({ ...prev, assessmentNotes: e.target.value }))}
              placeholder="Describe why the convictions are considered serious"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeSinceOffense">Time Since Offense</Label>
            <Input
              id="timeSinceOffense"
              value={finalNoticeData.timeSinceOffense}
              onChange={(e) => setFinalNoticeData(prev => ({ ...prev, timeSinceOffense: e.target.value }))}
              placeholder="Enter time since offense"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeSinceSentence">Time Since Sentence Completion</Label>
            <Input
              id="timeSinceSentence"
              value={finalNoticeData.timeSinceSentence}
              onChange={(e) => setFinalNoticeData(prev => ({ ...prev, timeSinceSentence: e.target.value }))}
              placeholder="Enter time since sentence completion"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobDuties">Job Duties</Label>
            <Textarea
              id="jobDuties"
              value={finalNoticeData.jobDuties}
              onChange={(e) => setFinalNoticeData(prev => ({ ...prev, jobDuties: e.target.value }))}
              placeholder="List relevant job duties"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fitnessImpact">Impact on Job Fitness</Label>
            <Textarea
              id="fitnessImpact"
              value={finalNoticeData.fitnessImpact}
              onChange={(e) => setFinalNoticeData(prev => ({ ...prev, fitnessImpact: e.target.value }))}
              placeholder="Explain how the conviction impacts job fitness"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={finalNoticeData.reconsiderationAllowed}
                onCheckedChange={(checked) => 
                  setFinalNoticeData(prev => ({ ...prev, reconsiderationAllowed: checked as boolean }))
                }
                className="h-5 w-5 border-2 border-gray-300 bg-white data-[state=checked]:bg-white data-[state=checked]:border-green-500 data-[state=checked]:text-green-500 focus:ring-green-500 transition"
              />
              Allow reconsideration requests
            </Label>
          </div>
          {finalNoticeData.reconsiderationAllowed && (
            <div className="space-y-2">
              <Label htmlFor="reconsiderationProcess">Reconsideration Process</Label>
              <Textarea
                id="reconsiderationProcess"
                value={finalNoticeData.reconsiderationProcess}
                onChange={(e) => setFinalNoticeData(prev => ({ ...prev, reconsiderationProcess: e.target.value }))}
                placeholder="Describe the reconsideration process"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Confirm Conditional Offer</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="offer-yes"
                  name="conditional-offer"
                  checked={hasConditionalOffer === "yes"}
                  onChange={() => setHasConditionalOffer("yes")}
                  className="h-5 w-5 appearance-none rounded-full border-2 border-gray-400 bg-white checked:bg-cinnabar checked:border-cinnabar checked:ring-0 checked:ring-offset-0 focus:ring-0 focus:ring-offset-0 transition
                    before:content-[''] before:block before:w-3 before:h-3 before:rounded-full before:mx-auto before:my-auto before:bg-cinnabar before:opacity-0 checked:before:opacity-100"
                  style={{
                    boxShadow: "none",
                    outline: "none",
                    position: "relative",
                  }}
                />
                <label htmlFor="offer-yes" className="text-base font-poppins font-normal">Yes, a conditional offer has been extended</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="offer-no"
                  name="conditional-offer"
                  checked={hasConditionalOffer === "no"}
                  onChange={() => setHasConditionalOffer("no")}
                  className="h-5 w-5 appearance-none rounded-full border-2 border-gray-400 bg-white checked:bg-cinnabar checked:border-cinnabar checked:ring-0 checked:ring-offset-0 focus:ring-0 focus:ring-offset-0 transition
                    before:content-[''] before:block before:w-3 before:h-3 before:rounded-full before:mx-auto before:my-auto before:bg-cinnabar before:opacity-0 checked:before:opacity-100"
                  style={{
                    boxShadow: "none",
                    outline: "none",
                    position: "relative",
                  }}
                />
                <label htmlFor="offer-no" className="text-base font-poppins font-normal">No, a conditional offer has not been extended</label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Validate Document Basis</h2>
            <p className="text-muted-foreground">
              Review the following criteria to ensure only legally permissible information is considered.
            </p>
            <div className="space-y-6">
              {/* Checklist Item 1 */}
              <div className="flex items-center gap-4">
                <Checkbox
                  id="old"
                  checked={documentValidation.isOld}
                  onCheckedChange={(checked) =>
                    setDocumentValidation(prev => ({ ...prev, isOld: checked as boolean }))
                  }
                  className="h-6 w-6 border-2 border-gray-300 bg-white data-[state=checked]:bg-white data-[state=checked]:text-green-500 focus:ring-0 focus:ring-offset-0 transition"
                  style={{ borderColor: "#d1d5db" }}
                />
                <div>
                  <div className="text-base font-bold font-poppins leading-tight">
                    Is the conviction more than 7 years old?
                  </div>
                  <div className="text-base font-normal font-poppins text-muted-foreground mt-1">
                    Unless supervising minors/dependent adults, convictions older than 7 years cannot be considered.
                  </div>
                </div>
              </div>
              {/* Checklist Item 2 */}
              <div className="flex items-center gap-4">
                <Checkbox
                  id="juvenile"
                  checked={documentValidation.isJuvenile}
                  onCheckedChange={(checked) =>
                    setDocumentValidation(prev => ({ ...prev, isJuvenile: checked as boolean }))
                  }
                  className="h-6 w-6 border-2 border-gray-300 bg-white data-[state=checked]:bg-white data-[state=checked]:text-green-500 focus:ring-0 focus:ring-offset-0 transition"
                  style={{ borderColor: "#d1d5db" }}
                />
                <div>
                  <div className="text-base font-bold font-poppins leading-tight">
                    Is the offense juvenile-related?
                  </div>
                  <div className="text-base font-normal font-poppins text-muted-foreground mt-1">
                    Juvenile records cannot be considered in employment decisions.
                  </div>
                </div>
              </div>
              {/* Checklist Item 3 */}
              <div className="flex items-center gap-4">
                <Checkbox
                  id="decriminalized"
                  checked={documentValidation.isDecriminalized}
                  onCheckedChange={(checked) =>
                    setDocumentValidation(prev => ({ ...prev, isDecriminalized: checked as boolean }))
                  }
                  className="h-6 w-6 border-2 border-gray-300 bg-white data-[state=checked]:bg-white data-[state=checked]:text-green-500 focus:ring-0 focus:ring-offset-0 transition"
                  style={{ borderColor: "#d1d5db" }}
                />
                <div>
                  <div className="text-base font-bold font-poppins leading-tight">
                    Is the conduct now decriminalized?
                  </div>
                  <div className="text-base font-normal font-poppins text-muted-foreground mt-1">
                    Decriminalized conduct (e.g., cannabis-related) cannot be considered.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Direct Job-Relation Inquiry</h2>
            <RadioGroup
              value={jobRelation.isRelated === null ? "" : jobRelation.isRelated.toString()}
              onValueChange={(value) => setJobRelation(prev => ({ ...prev, isRelated: value === "true" }))}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="related-yes" />
                  <Label htmlFor="related-yes">Yes, the conviction is directly related to job duties</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="related-no" />
                  <Label htmlFor="related-no">No, the conviction is not directly related</Label>
                </div>
              </div>
            </RadioGroup>

            {jobRelation.isRelated && (
              <div className="space-y-4">
                <div>
                  <Label>Select Related Job Duties</Label>
                  <Select
                    value={jobRelation.duties[0]}
                    onValueChange={(value) => setJobRelation(prev => ({ ...prev, duties: [value] }))}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Choose a job duty" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="financial">Financial Management</SelectItem>
                      <SelectItem value="sensitive">Access to Sensitive Data</SelectItem>
                      <SelectItem value="supervision">Supervision of Others</SelectItem>
                      <SelectItem value="security">Security Responsibilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Explain the Direct Relationship</Label>
                  <Textarea
                    value={jobRelation.explanation}
                    onChange={(e) => setJobRelation(prev => ({ ...prev, explanation: e.target.value }))}
                    placeholder="Describe how the conviction directly relates to job responsibilities..."
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Time Elapsed Analysis</h2>
            <Select
              value={timeElapsed}
              onValueChange={setTimeElapsed}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select time elapsed since offense" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="3-7">3-7 years</SelectItem>
                <SelectItem value="more-than-7">More than 7 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Evidence of Rehabilitation</h2>
            <RadioGroup
              value={rehabilitation.hasEvidence === null ? "" : rehabilitation.hasEvidence.toString()}
              onValueChange={(value) => setRehabilitation(prev => ({ ...prev, hasEvidence: value === "true" }))}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="evidence-yes" />
                  <Label htmlFor="evidence-yes">Yes, evidence was provided</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="evidence-no" />
                  <Label htmlFor="evidence-no">No evidence was provided</Label>
                </div>
              </div>
            </RadioGroup>

            <div>
              <Label>Rehabilitation Notes</Label>
              <Textarea
                value={rehabilitation.notes}
                onChange={(e) => setRehabilitation(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Document any evidence of rehabilitation or mitigating factors..."
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Assessment Summary</h2>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Job-relatedness</h3>
                <p>{jobRelation.isRelated ? "Directly related" : "Not directly related"}</p>
                {jobRelation.isRelated && (
                  <>
                    <p className="text-sm text-muted-foreground mt-2">Related duties:</p>
                    <ul className="list-disc pl-5">
                      {jobRelation.duties.map(duty => (
                        <li key={duty}>{duty}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Time Elapsed</h3>
                <p>{timeElapsed.replace("-", " to ")}</p>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Rehabilitation Evidence</h3>
                <p>{rehabilitation.hasEvidence ? "Evidence provided" : "No evidence provided"}</p>
                {rehabilitation.notes && (
                  <p className="text-sm text-muted-foreground mt-2">{rehabilitation.notes}</p>
                )}
              </div>

              <div className="flex items-start space-x-3 mt-6">
                <Checkbox
                  id="certification"
                  checked={certificationChecked}
                  onCheckedChange={(checked) => setCertificationChecked(checked as boolean)}
                />
                <Label htmlFor="certification" className="text-sm">
                  I certify that this decision complies with the Fair Chance Ordinance and is based solely on legally permissible information.
                </Label>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Candidate Notification</h2>
            <div className="rounded-lg border p-4 bg-muted">
              <h3 className="font-semibold mb-2">Notice of Intent to Take Adverse Action</h3>
              <p className="text-sm text-muted-foreground">
                You must give the candidate 7 days to respond before proceeding with any adverse action. During this time, no hiring decision may be finalized.
              </p>
            </div>
            <Button
              onClick={() => setShowNoticeDialog(true)}
            >
              Preview & Send Notice
            </Button>
          </div>
        );

      case 8:
        if (showWOTCSigningScreen) {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">WOTC Tax Credit Details</h2>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
                  Tax Credit Value
                </h3>
                <p className="text-green-700 dark:text-green-400 text-lg">
                  You are eligible for <span className="font-bold">40% of first-year wages</span> (up to $6,000) if the person works at least 400 hours as part of a WOTC targeted group.
                </p>
              </div>

              <Card className="p-6 bg-secondary">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div className="space-y-3">
                    <h4 className="font-semibold">Policy Information</h4>
                    <p className="text-sm text-muted-foreground">
                      The Work Opportunity Tax Credit (WOTC) is a federal tax credit available to employers who invest in American job seekers who have consistently faced barriers to employment. Employers may meet their business needs and claim a tax credit if they hire an individual who is in a WOTC targeted group.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Employers must apply for and receive a certification verifying the new hire is a member of a targeted group before they can claim the tax credit. After the required certification is secured, taxable employers claim the WOTC as a general business credit against their income taxes, and tax-exempt employers claim the WOTC against their payroll taxes.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      WOTC is authorized until December 31, 2025 (Section 113 of Division EE of P.L. 116-260 -- Consolidated Appropriations Act, 2021).
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSignAndSend}>
                  SIGN & SEND FOR REVIEW
                </Button>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Final Decision</h2>
            <div className="space-y-4">
              <Textarea
                placeholder="Provide final justification for the hiring decision..."
              />
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 ia-button-outline px-5 py-2 rounded-md text-base font-poppins"
                  onClick={handleProceedWithHire}
                >
                  Proceed with Hire
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 ia-button-primary bg-cinnabar text-white hover:bg-cinnabar-600 px-5 py-2 rounded-md text-base font-poppins"
                  onClick={() => setShowFinalNoticeDialog(true)}
                >
                  Take Adverse Action
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/3 border-r p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* RezMe Logo */}
            <div className="flex items-center mb-6">
              <Image
                src="/rezme-logo.png"
                alt="rézme logo"
                width={160}
                height={48}
                priority
                className="ml-2 mt-2"
                style={{ maxWidth: 200, maxHeight: 60, width: "auto", height: "auto" }}
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">Assessment Progress</h2>
            <div className="space-y-4">
              {steps.map((step) => (
                <button
                  key={step.id}
                  className={`w-full p-3 rounded-lg border ${
                    currentStep === step.id ? "bg-secondary" : ""
                  } transition-colors hover:bg-secondary/50`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className="flex items-center gap-2">
                    {step.completed ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border" />
                    )}
                    <span className={step.completed ? "text-muted-foreground" : ""}>
                      {step.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="space-y-6">
            <Card className="p-6">
              {renderStepContent()}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  className="ia-button-outline px-5 py-2 rounded-md text-base font-poppins"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep !== 8 && (
                  <Button
                    className="ia-button-primary bg-cinnabar text-white hover:bg-cinnabar-600 px-5 py-2 rounded-md text-base font-poppins"
                    onClick={currentStep === 8 ? handleComplete : handleNext}
                    disabled={
                      (currentStep === 1 && !hasConditionalOffer) ||
                      (currentStep === 6 && !certificationChecked)
                    }
                  >
                    {currentStep === 8 ? "Complete" : (
                      <>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <h3 className="font-semibold">Critical Information</h3>
              </div>
              
              {/* Tabs with Cinnabar accent for selected, light Cinnabar for unselected */}
              <Tabs defaultValue="policy" className="w-full">
                <TabsList className="w-full flex bg-transparent mb-0 p-0 rounded-none border-0 shadow-none justify-start gap-4">
                  <TabsTrigger
                    value="legal"
                    className={`font-poppins text-base px-8 py-3 rounded-t-xl font-semibold
                      data-[state=active]:bg-cinnabar data-[state=active]:text-white
                      data-[state=inactive]:bg-[#ffeceb] data-[state=inactive]:text-cinnabar
                      border-0 shadow-none outline-none transition-none
                    `}
                    style={{ zIndex: 2 }}
                  >
                    Legal
                  </TabsTrigger>
                  <TabsTrigger
                    value="policy"
                    className={`font-poppins text-base px-8 py-3 rounded-t-xl font-semibold
                      data-[state=active]:bg-cinnabar data-[state=active]:text-white
                      data-[state=inactive]:bg-[#ffeceb] data-[state=inactive]:text-cinnabar
                      border-0 shadow-none outline-none transition-none
                    `}
                    style={{ zIndex: 1 }}
                  >
                    Company Policy
                  </TabsTrigger>
                  <TabsTrigger
                    value="context"
                    className={`font-poppins text-base px-8 py-3 rounded-t-xl font-semibold
                      data-[state=active]:bg-cinnabar data-[state=active]:text-white
                      data-[state=inactive]:bg-[#ffeceb] data-[state=inactive]:text-cinnabar
                      border-0 shadow-none outline-none transition-none
                    `}
                    style={{ zIndex: 0 }}
                  >
                    Candidate Context
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="legal" className="pt-8 p-4 border rounded-b-lg border-t-0 -mt-2">
                  {getLegalGuidance()}
                </TabsContent>
                <TabsContent value="policy" className="pt-8 p-4 border rounded-b-lg border-t-0 -mt-2">
                  {getCompanyPolicy()}
                </TabsContent>
                <TabsContent value="context" className="pt-8 p-4 border rounded-b-lg border-t-0 -mt-2">
                  {getCandidateContext()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showOfferLetterDialog} onOpenChange={setShowOfferLetterDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Conditional Offer Letter</DialogTitle>
            <DialogDescription>
              Review and send the conditional offer letter to proceed with the background check.
            </DialogDescription>
          </DialogHeader>
          
          {renderOfferLetterContent()}

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditingLetter(!isEditingLetter)}
            >
              {isEditingLetter ? (
                <>Preview Letter</>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Letter
                </>
              )}
            </Button>
            <Button
              className="ia-button-primary bg-cinnabar text-white hover:bg-cinnabar-600"
              onClick={handleSendOfferLetter}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Offer Letter
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNoticeDialog} onOpenChange={setShowNoticeDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Notice of Preliminary Decision</DialogTitle>
            <DialogDescription>
              Review and send the notice of preliminary decision to revoke job offer.
            </DialogDescription>
          </DialogHeader>
          
          {renderNoticeContent()}

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditingNotice(!isEditingNotice)}
            >
              {isEditingNotice ? (
                <>Preview Notice</>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Notice
                </>
              )}
            </Button>
            <Button
              className="ia-button-primary bg-cinnabar text-white hover:bg-cinnabar-600"
              onClick={() => {
                toast({
                  title: "Notice Sent",
                  description: "The candidate has been notified and has 7 days to respond.",
                });
                setShowNoticeDialog(false);
                handleNext();
              }}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Notice
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFinalNoticeDialog} onOpenChange={setShowFinalNoticeDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Final Notice of Decision</DialogTitle>
            <DialogDescription>
              Review and send the final notice of decision to revoke job offer.
            </DialogDescription>
          </DialogHeader>
          
          {renderFinalNoticeContent()}

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditingFinalNotice(!isEditingFinalNotice)}
            >
              {isEditingFinalNotice ? (
                <>Preview Notice</>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Notice
                </>
              )}
            </Button>
            <Button
              className="ia-button-primary bg-cinnabar text-white hover:bg-cinnabar-600"
              onClick={() => {
                toast({
                  title: "Final Notice Sent",
                  description: "The final notice has been sent to the candidate.",
                });
                setShowFinalNoticeDialog(false);
                setShowCompleteModal(true);
              }}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Final Notice
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBlockingDialog} onOpenChange={setShowBlockingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conditional Offer Required</DialogTitle>
            <DialogDescription>
              You must extend a conditional offer before accessing or considering conviction history. This is a requirement under Cook County's Human Rights Ordinance.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCompletionWarning} onOpenChange={setShowCompletionWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Important Notice</DialogTitle>
            <DialogDescription className="space-y-4">
              <p>
                Before taking adverse action such as failing/refusing to hire, discharging, or not promoting an individual based on a conviction history or unresolved arrest, you must give the individual an opportunity to present evidence that:
                           </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The information is inaccurate</li>
                <li>The individual has been rehabilitated</li>
                <li>There are other mitigating factors</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                This follows procedures outlined in Police Code Section 4909 or L.E.C. Article 142.4
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleComplianceAcknowledge}>I Understand</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showComplianceConfirmation} onOpenChange={setShowComplianceConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compliance Acknowledgment</DialogTitle>
            <DialogDescription className="space-y-4">
              <p className="text-sm">
                SEC. 4909. IMPLEMENTATION AND ENFORCEMENT OF EMPLOYMENT PROVISIONS.
                (a) Administrative Enforcement.
                (1) With regard to the employment provisions of this Article 49, the OLSE is authorized to take appropriate steps to enforce this Article and coordinate enforcement, including the investigation of any possible violations of this Article. Where the OLSE has reason to believe that a violation has occurred, it may order any appropriate temporary or interim relief to mitigate the violation or maintain the status quo pending completion of a full investigation or hearing. The OLSE shall not find a violation based on an Employer's decision that an applicant or employee's Conviction History is Directly Related, but otherwise may find a violation of this Article, including if the Employer failed to conduct the individualized assessment as required under Section 4904(f).
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="compliance"
                  checked={complianceAcknowledged}
                  onCheckedChange={(checked) => setComplianceAcknowledged(checked as boolean)}
                />
                <Label htmlFor="compliance">
                  I acknowledge and understand these requirements
                </Label>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleComplianceConfirm} disabled={!complianceAcknowledged}>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTimeframeDialog} onOpenChange={setShowTimeframeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Additional Evidence Opportunity</DialogTitle>
            <DialogDescription>
              Would you like to give the candidate another chance to provide evidence or dispute the information in the criminal background report?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <RadioGroup
              value={giveAnotherChance === null ? "" : giveAnotherChance.toString()}
              onValueChange={(value) => setGiveAnotherChance(value === "true")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>

            {giveAnotherChance && (
              <div className="space-y-2">
                <Label>Response Timeframe (in business days)</Label>
                <Input
                  type="number"
                  min="1"
                  value={responseTimeframe}
                  onChange={(e) => setResponseTimeframe(e.target.value)}
                  placeholder="Enter number of days"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleTimeframeSubmit} disabled={giveAnotherChance === null || (giveAnotherChance && !responseTimeframe)}>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFinalDialog} onOpenChange={setShowFinalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assessment Complete</DialogTitle>
            <DialogDescription className="space-y-4">
              <p>
                Congratulations! You have completed the Fair Chance assessment process.
                {giveAnotherChance && (
                  <>
                    <br /><br />
                    If the candidate does not respond within {responseTimeframe} business days, your decision will be final and all documentation will be stored for future compliance audits.
                  </>
                )}
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleReturnToDashboard}>
              Return to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showWOTCModal} onOpenChange={setShowWOTCModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Congratulations on Your Fair Chance Hire!</DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p>Based on your Fair Chance Hiring Protocol, WE applied for WOTC, by following these steps:</p>
              
              <div className="space-y-2">
                <p>✓ Pre-Screening: Checked that the candidate qualifies for the WOTC.</p>
                
                <p>WE auto filled out the two required forms:</p>
                <ul className="list-disc pl-6">
                  <li>The Individual Characteristics Form (ETA 9061)</li>
                  <li>The Pre-Screening Notice and Certification Request (IRS Form 8850)</li>
                </ul>

                <ul className="space-y-2 mt-4">
                  <li>• You can sign the necessary forms with the person applying for the job on the next screen.</li>
                  <li>• Forms have been automatically filed and sent online to the Work Opportunity Tax Credit Online (eWOTC) system.</li>
                  <li>• Digital Forms were also downloaded and sent by mail to the EDD.</li>
                  <li>• Forms are automatically sent within 28 days of the person starting the job.</li>
                  <li>• Since the person qualifies as a long-term unemployed recipient, we'll include the Self-Attestation Form (ETA Form 9175) from them.</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button onClick={handleContinueToSigning}>
              Continue to Signing Forms
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assessment Complete</DialogTitle>
            <DialogDescription>
              You have completed the Fair Chance assessment process. Click Complete to finalize.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => { setShowCompleteModal(false); handleComplete(); }}>
              Complete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showWOTCCongratsModal} onOpenChange={setShowWOTCCongratsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription>
              Through our integration with your HRIS, we will track your employee's hours and eligibility for the maximum tax credit return. All compliance steps have been recorded and securely stored for audit purposes for three years.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => { setShowWOTCCongratsModal(false); router.push("/"); }}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}