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
import { Dialog as PreviewDialog, DialogContent as PreviewDialogContent, DialogHeader as PreviewDialogHeader, DialogTitle as PreviewDialogTitle } from "@/components/ui/dialog";

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
    isDismissed: false,
    isOlderThan5: false,
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
    fitnessImpact: "",
    selectedExceptions: [] as string[],
    exceptionExplanation: "",
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

  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [jobRelationException, setJobRelationException] = useState(false);
  // Add state for selected exceptions:
  const [selectedExceptions, setSelectedExceptions] = useState<string[]>([]);

  const exceptionOptions = [
    "Applicable law excludes applicants with certain criminal convictions from the relevant position.",
    "A standard fidelity bond or an equivalent bond is required for the relevant position, and an applicant's conviction of one or more specified criminal offenses would disqualify the applicant from obtaining such a bond, in which case an employer may include a question or otherwise inquire whether the applicant has ever been convicted of any of those offenses.",
    "There is a substantial relationship between one or more of the criminal offenses in the person's conviction record and the employment sought or held. 'Substantial relationship' means a consideration of whether the employment position offers the opportunity for the same or a similar offense to occur and whether the circumstances leading to the conduct for which the person was convicted will recur in the employment position.",
    "The granting or continuation of the employment would involve an unreasonable risk to property or to the safety or welfare of specific individuals or the general public."
  ];

  // Add state for the iFrame modal in Evidence of Rehabilitation step
  const [showNoEvidenceModal, setShowNoEvidenceModal] = useState(false);

  // Add state for checkboxes in Direct Job-Relation Inquiry step
  const [jobRelationSelections, setJobRelationSelections] = useState({ exception: false, related: false, unrelated: false });

  const [showPreviewNotice, setShowPreviewNotice] = useState(false);

  // Legal exceptions for disqualification (move to top of component)
  const disqualifyingExceptions: string[] = [
    "Applicable federal/state/local law excludes applicants with certain convictions",
    "Fidelity or other equivalent bond is required",
    "Substantial/direct relationship to the position (meaning a) the position offers an opportunity for similar crime to repeat or b) the convicted conduct will recur in the position)",
    "Unreasonable risk to property/safety/welfare of an individual or general public",
  ];

  // Add to state:
  const [timeElapsedAge, setTimeElapsedAge] = useState<string>("");

  // Add to state:
  const [taggedSupervisors, setTaggedSupervisors] = useState<string[]>([]);
  const supervisorOptions = [
    "cristina.williams@cityofchicago.org",
    "deborah.anderson@cityofchicago.org",
    "hallie.lovin@cityofchicago.org",
    "jazmine.valadez@cityofchicago.org",
    "joseph.mapp@cityofchicago.org",
    "morrigan.sullivan@cityofchicago.org",
  ];
  const [supervisorInput, setSupervisorInput] = useState("");
  const [showSupervisorDropdown, setShowSupervisorDropdown] = useState(false);

  // Add to state:
  const [showPreviewFinalNotice, setShowPreviewFinalNotice] = useState(false);

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
        // Confirm Conditional Offer
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Fair Chance Policy</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>It is the policy of the City of Chicago to assure equal access to employment and protect civil rights for all persons, including those with a criminal history.</li>
              <li>Employers may not inquire into or use arrest records as a basis to refuse to hire or take adverse action.</li>
              <li>Employers may only consider conviction records under specific, legally defined circumstances.</li>
            </ul>
            <p className="text-xs text-muted-foreground">Reference: Chicago Human Rights Ordinance 6-10-010, 6-10-054</p>
            <p className="text-xs text-muted-foreground mt-2">Source: <a href="https://www.chicago.gov/city/en/depts/cchr/supp_info/chicago_human_rights_ordinance.html" target="_blank" rel="noopener noreferrer" className="underline">Chicago Human Rights Ordinance</a></p>
          </div>
        );
      case 2:
        // Validate Document Basis
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Arrest and Conviction Records</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Employers may not use arrest records (including juvenile records, expunged/sealed records, or arrests not leading to conviction) as a basis for employment decisions.</li>
              <li>Conviction records may only be considered if one or more of the following exceptions apply:</li>
              <ul className="list-disc pl-8 text-sm">
                <li>Applicable law excludes applicants with certain convictions from the position.</li>
                <li>A fidelity or equivalent bond is required and the conviction disqualifies the applicant from obtaining it.</li>
                <li>There is a substantial relationship between the conviction and the job duties.</li>
                <li>Employment would involve an unreasonable risk to property, safety, or welfare.</li>
            </ul>
            </ul>
            <p className="text-xs text-muted-foreground">Reference: 6-10-054(a)-(b)</p>
            <p className="text-xs text-muted-foreground mt-2">Source: <a href="https://www.chicago.gov/city/en/depts/cchr/supp_info/chicago_human_rights_ordinance.html" target="_blank" rel="noopener noreferrer" className="underline">Chicago Human Rights Ordinance</a></p>
          </div>
        );
      case 3:
        // Direct Job-Relation Inquiry
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Direct Job-Relation & Legal Exceptions</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Employers may only consider a conviction record if there is a substantial or direct relationship to the position, or if employment would involve an unreasonable risk.</li>
              <li><span className="font-semibold">Substantial relationship</span> means the job offers an opportunity for a similar offense to occur, or the circumstances leading to the conviction could recur in the position.</li>
              <li>Employers must consider the nature and severity of the conviction, its relationship to safety and security, and the facts or circumstances surrounding the conviction.</li>
            </ul>
            <p className="text-xs text-muted-foreground">Reference: 6-10-054(b)-(c)</p>
            <p className="text-xs text-muted-foreground mt-2">Source: <a href="https://www.chicago.gov/city/en/depts/cchr/supp_info/chicago_human_rights_ordinance.html" target="_blank" rel="noopener noreferrer" className="underline">Chicago Human Rights Ordinance</a></p>
          </div>
        );
      case 4:
        // Time Elapsed Analysis
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Time & Rehabilitation Factors</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Employers must consider the length of time since the conviction and the age of the employee at the time of the conviction.</li>
              <li>Other required factors: number of convictions, nature/severity, facts/circumstances, and evidence of rehabilitation.</li>
            </ul>
            <p className="text-xs text-muted-foreground">Reference: 6-10-054(c)</p>
            <p className="text-xs text-muted-foreground mt-2">Source: <a href="https://www.chicago.gov/city/en/depts/cchr/supp_info/chicago_human_rights_ordinance.html" target="_blank" rel="noopener noreferrer" className="underline">Chicago Human Rights Ordinance</a></p>
          </div>
        );
      case 5:
        // Evidence of Rehabilitation
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Evidence of Rehabilitation</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Employers must consider any evidence of rehabilitation efforts provided by the applicant or employee.</li>
              <li>Rehabilitation may include completion of education, job training, treatment programs, or other positive changes since the conviction.</li>
                </ul>
            <p className="text-xs text-muted-foreground">Reference: 6-10-054(c)(6)</p>
            <p className="text-xs text-muted-foreground mt-2">Source: <a href="https://www.chicago.gov/city/en/depts/cchr/supp_info/chicago_human_rights_ordinance.html" target="_blank" rel="noopener noreferrer" className="underline">Chicago Human Rights Ordinance</a></p>
          </div>
        );
      case 6:
        // Assessment Summary
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Summary of Legal Requirements</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Employers must base decisions only on legally permissible information and must document their individualized assessment process.</li>
              <li>All factors (time, nature, number, circumstances, age, rehabilitation) must be considered before making a final decision.</li>
            </ul>
            <p className="text-xs text-muted-foreground">Reference: 6-10-054(c)</p>
            <p className="text-xs text-muted-foreground mt-2">Source: <a href="https://www.chicago.gov/city/en/depts/cchr/supp_info/chicago_human_rights_ordinance.html" target="_blank" rel="noopener noreferrer" className="underline">Chicago Human Rights Ordinance</a></p>
          </div>
        );
      case 7:
        // Candidate Notification
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Pre-Adverse Action Notice</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>If a preliminary decision is made to disqualify based on a conviction record, the employer must notify the candidate in writing.</li>
              <li>The notice must include: the disqualifying conviction(s), a copy of the conviction record, and an explanation of the right to respond (including evidence of inaccuracy or rehabilitation).</li>
              <li>The candidate must be given at least 5 business days to respond before a final decision is made.</li>
            </ul>
            <p className="text-xs text-muted-foreground">Reference: 6-10-054(d)</p>
            <p className="text-xs text-muted-foreground mt-2">Source: <a href="https://www.chicago.gov/city/en/depts/cchr/supp_info/chicago_human_rights_ordinance.html" target="_blank" rel="noopener noreferrer" className="underline">Chicago Human Rights Ordinance</a></p>
          </div>
        );
      case 8:
        // Final Decision
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Final Adverse Action</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Before taking final adverse action, the employer must consider any information submitted by the candidate in response to the pre-adverse notice.</li>
              <li>If a final decision is made to disqualify, the employer must notify the candidate in writing, including: the disqualifying conviction(s), any appeal/reconsideration process, and the right to file a complaint with the Commission.</li>
            </ul>
            <p className="text-xs text-muted-foreground">Reference: 6-10-054(d)(3)</p>
            <p className="text-xs text-muted-foreground mt-2">Source: <a href="https://www.chicago.gov/city/en/depts/cchr/supp_info/chicago_human_rights_ordinance.html" target="_blank" rel="noopener noreferrer" className="underline">Chicago Human Rights Ordinance</a></p>
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
            Pursuant to the Chicago Human Rights Ordinance, we consider for employment qualified applicants with arrest and conviction records.
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
            We are committed to fair hiring practices and fully adheres to the requirements set forth by the Chicago Commission on Human Rights under the Human Rights Ordinance. This includes providing applicants with automated notice of their right to file a complaint with the Commission if they believe we are not in compliance with the law.
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
      default:
        return (
          <div className="text-sm text-muted-foreground">
            The candidate holds a Certificate of Rehabilitation—a court-issued order affirming that an individual convicted of a felony and previously incarcerated in state or local prison has demonstrated rehabilitation under the law.
          </div>
        );
    }
  };

  // Restore the renderStepContent function
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
                  className="h-5 w-5 appearance-none rounded-full border-2 border-gray-400 bg-white checked:bg-cinnabar checked:border-cinnabar checked:ring-0 checked:ring-offset-0 focus:ring-0 focus:ring-offset-0 transition before:content-[''] before:block before:w-3 before:h-3 before:rounded-full before:mx-auto before:my-auto before:bg-cinnabar before:opacity-0 checked:before:opacity-100"
                  style={{ boxShadow: "none", outline: "none", position: "relative" }}
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
                  className="h-5 w-5 appearance-none rounded-full border-2 border-gray-400 bg-white checked:bg-cinnabar checked:border-cinnabar checked:ring-0 checked:ring-offset-0 focus:ring-0 focus:ring-offset-0 transition before:content-[''] before:block before:w-3 before:h-3 before:rounded-full before:mx-auto before:my-auto before:bg-cinnabar before:opacity-0 checked:before:opacity-100"
                  style={{ boxShadow: "none", outline: "none", position: "relative" }}
                />
                <label htmlFor="offer-no" className="text-base font-poppins font-normal">No, a conditional offer has not been extended</label>
              </div>
            </div>
          </div>
        );
      case 2:
        // Validate Document Basis step (already implemented above)
        return (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="space-y-6 md:w-1/2">
            <h2 className="text-2xl font-bold">Validate Document Basis</h2>
            <p className="text-muted-foreground">
              Review the following criteria to ensure only legally permissible information is considered.
            </p>
            <div className="space-y-6">
                {/* Checklist Items */}
              <div className="flex items-center gap-4">
                <Checkbox
                    id="decriminalized-conduct"
                    checked={documentValidation.isDecriminalized}
                    onCheckedChange={(checked) => setDocumentValidation(prev => ({ ...prev, isDecriminalized: checked as boolean }))}
                  className="h-6 w-6 border-2 border-gray-300 bg-white data-[state=checked]:bg-white data-[state=checked]:text-green-500 focus:ring-0 focus:ring-offset-0 transition"
                  style={{ borderColor: "#d1d5db" }}
                />
                <div>
                  <div className="text-base font-bold font-poppins leading-tight">
                      Are any convictions for decriminalized conduct, including those related to cannabis consumption or possession?
                  </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Checkbox
                    id="arrests-no-conviction"
                    checked={documentValidation.isOld}
                    onCheckedChange={(checked) => setDocumentValidation(prev => ({ ...prev, isOld: checked as boolean }))}
                    className="h-6 w-6 border-2 border-gray-300 bg-white data-[state=checked]:bg-white data-[state=checked]:text-green-500 focus:ring-0 focus:ring-offset-0 transition"
                    style={{ borderColor: "#d1d5db" }}
                  />
                  <div>
                    <div className="text-base font-bold font-poppins leading-tight">
                      Are there Arrests that did not lead to a conviction?
              </div>
                  </div>
                </div>
              <div className="flex items-center gap-4">
                <Checkbox
                    id="juvenile-convictions"
                  checked={documentValidation.isJuvenile}
                    onCheckedChange={(checked) => setDocumentValidation(prev => ({ ...prev, isJuvenile: checked as boolean }))}
                  className="h-6 w-6 border-2 border-gray-300 bg-white data-[state=checked]:bg-white data-[state=checked]:text-green-500 focus:ring-0 focus:ring-offset-0 transition"
                  style={{ borderColor: "#d1d5db" }}
                />
                <div>
                  <div className="text-base font-bold font-poppins leading-tight">
                      Are there Convictions from the juvenile justice system?
                  </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Checkbox
                    id="dismissed-expunged-sealed"
                    checked={documentValidation.isDismissed}
                    onCheckedChange={(checked) => setDocumentValidation(prev => ({ ...prev, isDismissed: checked as boolean }))}
                    className="h-6 w-6 border-2 border-gray-300 bg-white data-[state=checked]:bg-white data-[state=checked]:text-green-500 focus:ring-0 focus:ring-offset-0 transition"
                    style={{ borderColor: "#d1d5db" }}
                  />
                  <div>
                    <div className="text-base font-bold font-poppins leading-tight">
                      Are there convictions that have been dismissed, expunged, or sealed?
              </div>
                  </div>
                </div>
              <div className="flex items-center gap-4">
                <Checkbox
                    id="older-than-5"
                    checked={documentValidation.isOlderThan5}
                    onCheckedChange={(checked) => setDocumentValidation(prev => ({ ...prev, isOlderThan5: checked as boolean }))}
                  className="h-6 w-6 border-2 border-gray-300 bg-white data-[state=checked]:bg-white data-[state=checked]:text-green-500 focus:ring-0 focus:ring-offset-0 transition"
                  style={{ borderColor: "#d1d5db" }}
                />
                <div>
                  <div className="text-base font-bold font-poppins leading-tight">
                      Are there convictions that are more than 5 years old?
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 hidden md:block">
              <iframe
                src="/Background_Check_Summary_Jacobi_Iverson.pdf"
                title="Background Report"
                className="w-full h-[600px] border rounded"
              />
            </div>
          </div>
        );
      case 3:
        // Direct Job-Relation Inquiry step
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Direct Job-Relation Inquiry</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                <Checkbox
                  id="related-exception"
                  checked={jobRelationSelections.exception}
                  onCheckedChange={(checked) => {
                    setJobRelationSelections(prev => ({ ...prev, exception: checked as boolean }));
                    if (checked) setShowExceptionModal(true);
                  }}
                />
                <Label htmlFor="related-exception">Requires an exception</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="related-yes"
                  checked={jobRelationSelections.related}
                  onCheckedChange={(checked) => setJobRelationSelections(prev => ({ ...prev, related: checked as boolean }))}
                />
                  <Label htmlFor="related-yes">Yes, the conviction is directly related to job duties</Label>
                </div>
                <div className="flex items-center space-x-2">
                <Checkbox
                  id="related-no"
                  checked={jobRelationSelections.unrelated}
                  onCheckedChange={(checked) => setJobRelationSelections(prev => ({ ...prev, unrelated: checked as boolean }))}
                />
                <Label htmlFor="related-no">No, the conviction is not directly related to job duties</Label>
                </div>
              </div>
            {/* Show selected exceptions if chosen */}
            {jobRelationSelections.exception && selectedExceptions.length > 0 && (
              <div className="mt-4 p-3 border rounded bg-muted">
                <div className="font-semibold mb-2">Selected Exception(s):</div>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {selectedExceptions.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Show job duty/explanation fields if related is checked */}
            {jobRelationSelections.related && (
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
        // Time Elapsed Analysis step (updated dropdown)
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
                <SelectItem value="1">1 year</SelectItem>
                <SelectItem value="2">2 years</SelectItem>
                <SelectItem value="3">3 years</SelectItem>
                <SelectItem value="4">4 years</SelectItem>
                <SelectItem value="5">5 years</SelectItem>
                <SelectItem value="6">6 years</SelectItem>
                <SelectItem value="7">7 years</SelectItem>
                <SelectItem value="7plus">7+ years</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <Label htmlFor="timeElapsedAge" className="font-semibold mt-4">Age of Employee at Time of Conviction</Label>
              <Input
                id="timeElapsedAge"
                type="number"
                min="0"
                value={timeElapsedAge}
                onChange={e => setTimeElapsedAge(e.target.value)}
                placeholder="Enter age at time of conviction"
                className="mt-1 w-48"
              />
            </div>
          </div>
        );
      case 5:
        // Evidence of Rehabilitation step
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Evidence of Rehabilitation</h2>
            <RadioGroup
              value={rehabilitation.hasEvidence === null ? "" : rehabilitation.hasEvidence.toString()}
              onValueChange={(value) => {
                setRehabilitation(prev => ({ ...prev, hasEvidence: value === "true" }));
                if (value === "false") setShowNoEvidenceModal(true);
              }}
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
            {/* Modal for No Evidence PDF */}
            <Dialog open={showNoEvidenceModal} onOpenChange={setShowNoEvidenceModal}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Candidate's Response</DialogTitle>
                </DialogHeader>
                <div className="w-full h-[600px]">
                  <iframe
                    src="/Jacobi%20Iverson%20-%20Restorative%20Record%20.pdf"
                    title="Candidate Response PDF"
                    className="w-full h-full border rounded"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setShowNoEvidenceModal(false)}>Close</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      case 6:
        // Assessment Summary step
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
        // Candidate Notification step
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Candidate Notification</h2>
            <div className="rounded-lg border p-4 bg-muted">
              <h3 className="font-semibold mb-2">Notice of Intent to Take Adverse Action</h3>
              <p className="text-sm text-muted-foreground">
                You must give the candidate 7 days to respond before proceeding with any adverse action. During this time, no hiring decision may be finalized.
              </p>
            </div>
            <Button onClick={() => setShowNoticeDialog(true)}>
              Preview & Send Notice
            </Button>
          </div>
        );
      case 8:
        // Final Decision step (WOTC logic handled elsewhere)
        if (showWOTCSigningScreen) {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">WOTC Tax Credit Details</h2>
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Tax Credit Value</h3>
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
                <Button onClick={handleSignAndSend}>SIGN & SEND FOR REVIEW</Button>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Final Decision</h2>
            <div className="space-y-4">
              <Textarea placeholder="Provide final justification for the hiring decision..." />
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

  // Restore the original renderOfferLetterContent function and modal UI
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
            Prohibit the consideration of the following items that may arise from a background check in hiring decisions:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Any conviction for decriminalized conduct, including those related to cannabis consumption or possession.</li>
            <li>Arrests that did not lead to a conviction.</li>
            <li>Convictions from the juvenile justice system.</li>
            <li>A conviction that has been dismissed, expunged, or sealed.</li>
            <li>A conviction that is more than 5 years old, unless there are legal, funding, or grant requirements tied to the role, or it is within the Mayor's Office, which shall be subject to a 7-year lookback period.</li>
          </ul>
          <p>
            As required by the Chicago Human Rights Ordinance, we will consider whether your conviction history is directly related
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

  // Update renderNoticeContent to be an interactive form with the specified elements
  const renderNoticeContent = () => {
    return (
      <form className="space-y-6 max-h-[60vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">Pre-Adverse Action Notice</h2>
        {/* Candidate Name and Position Title fields at the top */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="notice-applicantName" className="font-semibold">Candidate Name</Label>
            <Input
              id="notice-applicantName"
              value={noticeData.applicantName}
              onChange={e => setNoticeData(prev => ({ ...prev, applicantName: e.target.value }))}
              placeholder="Enter candidate's full name"
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="notice-position" className="font-semibold">Position Title</Label>
            <Input
              id="notice-position"
              value={noticeData.position}
              onChange={e => setNoticeData(prev => ({ ...prev, position: e.target.value }))}
              placeholder="Enter position title"
              className="mt-1"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="convictionRecord" className="font-semibold">1. Conviction Record/History Report (if any)</Label>
            {/* Visual cue for attached background report */}
            <div className="flex items-center gap-2 mt-2 mb-2 p-2 bg-gray-50 border border-gray-200 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cinnabar" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.07-7.07a4 4 0 00-5.657-5.657l-7.071 7.07a6 6 0 108.485 8.486L20.5 13" /></svg>
              <span className="text-sm text-cinnabar font-medium">Background_Check_Summary_Jacobi_Iverson.pdf</span>
              <span className="text-xs text-muted-foreground ml-2">(Background report attached and will be sent with this notice)</span>
            </div>
            <Textarea
              id="convictionRecord"
              value={noticeData.convictions}
              onChange={(e) => setNoticeData(prev => ({ ...prev, convictions: e.target.value }))}
              placeholder="Enter the candidate's conviction record or background check findings, if any."
              className="mt-2"
            />
          </div>
          
          <div>
            <Label className="font-semibold">2. The Disqualifying Conviction(s) and Explanation</Label>
            <div className="space-y-2 mt-2">
              {disqualifyingExceptions.map((option: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox
                    id={`exception-${idx}`}
                    checked={noticeData.selectedExceptions.includes(option)}
                    onCheckedChange={checked => {
                      setNoticeData(prev => ({
                        ...prev,
                        selectedExceptions: checked
                          ? [...prev.selectedExceptions, option]
                          : prev.selectedExceptions.filter((o: string) => o !== option),
                      }));
                    }}
                  />
                  <label htmlFor={`exception-${idx}`} className="text-sm cursor-pointer select-none">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <Label htmlFor="exceptionExplanation" className="text-sm">Additional Explanation (optional)</Label>
              <Textarea
                id="exceptionExplanation"
                value={noticeData.exceptionExplanation}
                onChange={e => setNoticeData(prev => ({ ...prev, exceptionExplanation: e.target.value }))}
                placeholder="Provide any additional explanation for the disqualification (optional)"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">3. Applicant's Right to Respond</h3>
            <p className="text-sm text-blue-700 mb-3">
              You have the right to respond to this notice before any final decision is made. You may:
            </p>
            <ul className="text-sm text-blue-700 space-y-1 mb-3 list-disc pl-5">
              <li>Challenge the accuracy of the conviction record</li>
              <li>Provide evidence of rehabilitation or mitigation</li>
              <li>Submit any other information you wish us to consider</li>
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <h3 className="font-semibold text-yellow-800 mb-2">4. Response Deadlines</h3>
            <div className="space-y-2 text-sm">
              <p className="text-yellow-700">
                <strong>Chicago HRO & IHRA Compliance:</strong> You have <strong>5 business days</strong> from the date of this notice to respond.
              </p>
              <p className="text-yellow-700">
                <strong>EBFA Compliance:</strong> You have <strong>7 calendar days</strong> from the date of this notice to respond.
              </p>
              <p className="text-yellow-700 font-semibold">
                No final adverse action will be taken until the applicable response period has passed.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
            <h3 className="font-semibold text-green-800 mb-2">5. EBFA Compliance Notice</h3>
            <p className="text-sm text-green-700">
              <strong>Employer Notification Requirement:</strong> As required by the Employee Background Fairness Act (EBFA), 
              we will notify you before or when filling the position if you are not selected for this role.
            </p>
          </div>
        </div>
      </form>
    );
  };

  const renderFinalNoticeContent = () => {
    return (
      <div className="space-y-6">
        <h3 className="font-semibold text-xl">Final Notice of Decision</h3>
        <div className="space-y-4">
          {/* 1. Conviction(s) leading to the decision */}
          <div>
            <div className="font-semibold mb-1">Conviction(s) Leading to This Decision</div>
            <Textarea
              value={finalNoticeData.assessmentNotes}
              onChange={(e) => setFinalNoticeData(prev => ({ ...prev, assessmentNotes: e.target.value }))}
              placeholder="State the conviction(s) that led to this adverse decision."
              className="bg-white"
            />
          </div>

          {/* 2. Appeal process (reconsideration request) */}
          <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <div className="font-semibold mb-1">Appeal Process (Reconsideration Request)</div>
            <Textarea
              value={finalNoticeData.reconsiderationProcess}
              onChange={(e) => setFinalNoticeData(prev => ({ ...prev, reconsiderationProcess: e.target.value }))}
              placeholder="Describe the process for appealing or requesting reconsideration, if any."
              className="bg-white"
            />
          </div>

          {/* 3. Right to file a complaint with the commission */}
          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="font-semibold mb-1">Right to File a Complaint with the Commission</div>
            <p className="text-sm mb-1">
              You have the right to file a complaint of discrimination with:
            </p>
            <ul className="list-disc pl-6 text-sm mb-2">
              <li><span className="font-semibold">Illinois Department of Human Rights (IDHR):</span> <a href="https://dhr.illinois.gov/" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">https://dhr.illinois.gov/</a> | (312) 814-6200</li>
              <li><span className="font-semibold">Chicago Commission on Human Relations (CCHR):</span> <a href="https://www.chicago.gov/city/en/depts/cchr.html" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">https://www.chicago.gov/city/en/depts/cchr.html</a> | (312) 744-4111</li>
            </ul>
            <p className="text-xs text-muted-foreground">You may file a complaint if you believe this decision was made in violation of your rights under state or local law.</p>
          </div>

          {/* Supervisor Tagging Section */}
          <div>
            <Label className="font-semibold mb-1">Tag Supervisor(s) for Review</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {taggedSupervisors.map((email) => (
                <span key={email} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {email}
                  <button
                    type="button"
                    className="ml-1 text-blue-600 hover:text-red-600"
                    onClick={() => setTaggedSupervisors(taggedSupervisors.filter(e => e !== email))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <Input
              value={supervisorInput}
              onChange={e => {
                setSupervisorInput(e.target.value);
                setShowSupervisorDropdown(e.target.value.includes("@"));
              }}
              onFocus={() => supervisorInput.includes("@") && setShowSupervisorDropdown(true)}
              onBlur={() => setTimeout(() => setShowSupervisorDropdown(false), 150)}
              placeholder="Type @ to tag a supervisor"
              className="w-full"
            />
            {showSupervisorDropdown && (
              <div className="absolute z-50 bg-white border rounded shadow mt-1 w-80 max-w-full">
                {supervisorOptions.filter(opt =>
                  opt.toLowerCase().includes(supervisorInput.replace("@", "").toLowerCase()) &&
                  !taggedSupervisors.includes(opt)
                ).map(opt => (
                  <div
                    key={opt}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                    onMouseDown={() => {
                      setTaggedSupervisors([...taggedSupervisors, opt]);
                      setSupervisorInput("");
                      setShowSupervisorDropdown(false);
                    }}
                  >
                    {opt}
                  </div>
                ))}
                {supervisorOptions.filter(opt =>
                  opt.toLowerCase().includes(supervisorInput.replace("@", "").toLowerCase()) &&
                  !taggedSupervisors.includes(opt)
                ).length === 0 && (
                  <div className="px-3 py-2 text-muted-foreground text-xs">No matches</div>
                )}
              </div>
            )}
          </div>

        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setShowPreviewFinalNotice(true)}
          >
            Preview Final Notice
          </Button>
          <Button
            className="ia-button-primary bg-cinnabar text-white hover:bg-cinnabar-600"
            onClick={() => {
              toast({
                title: "Final Notice Sent",
                description: "The final notice has been sent to the candidate.",
              });
              setShowFinalNoticeDialog(false);
              setShowComplianceConfirmation(true);
            }}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Final Notice
          </Button>
        </div>
        {/* Preview Final Notice Modal */}
        <PreviewDialog open={showPreviewFinalNotice} onOpenChange={setShowPreviewFinalNotice}>
          <PreviewDialogContent className="max-w-3xl">
            <PreviewDialogHeader>
              <PreviewDialogTitle>Preview: Final Notice Letter</PreviewDialogTitle>
            </PreviewDialogHeader>
            <div className="overflow-y-auto max-h-[70vh]">{renderFinalNoticePreview()}</div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowPreviewFinalNotice(false)}>Close Preview</Button>
            </div>
          </PreviewDialogContent>
        </PreviewDialog>
      </div>
    );
  };

  // Function to render the preview of the final notice
  const renderFinalNoticePreview = () => (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow border">
      <div className="mb-6">
        <div className="text-lg font-bold mb-1">Final Notice of Decision</div>
        <div className="text-sm text-muted-foreground mb-2">Adverse Action Notification</div>
        <div className="text-xs text-muted-foreground">Date: {new Date().toLocaleDateString()}</div>
      </div>
      <div className="mb-6">
        <p className="mb-2">Dear Candidate,</p>
        <p className="mb-4">This notice is to inform you of a final decision regarding your employment application. Please review the following information and your rights under the law.</p>
        <div className="mb-4">
          <div className="font-semibold mb-1">Conviction(s) Leading to This Decision</div>
          <div className="text-sm bg-gray-50 border rounded p-2 whitespace-pre-line">{finalNoticeData.assessmentNotes || <span className="italic text-muted-foreground">No details provided.</span>}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Appeal Process (Reconsideration Request)</div>
          <div className="text-sm bg-gray-50 border rounded p-2 whitespace-pre-line">{finalNoticeData.reconsiderationProcess || <span className="italic text-muted-foreground">No process provided.</span>}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Right to File a Complaint with the Commission</div>
          <ul className="list-disc pl-6 text-sm mb-2">
            <li><span className="font-semibold">Illinois Department of Human Rights (IDHR):</span> <a href="https://dhr.illinois.gov/" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">https://dhr.illinois.gov/</a> | (312) 814-6200</li>
            <li><span className="font-semibold">Chicago Commission on Human Relations (CCHR):</span> <a href="https://www.chicago.gov/city/en/depts/cchr.html" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">https://www.chicago.gov/city/en/depts/cchr.html</a> | (312) 744-4111</li>
          </ul>
          <div className="text-xs text-muted-foreground">You may file a complaint if you believe this decision was made in violation of your rights under state or local law.</div>
        </div>
        {taggedSupervisors && taggedSupervisors.length > 0 && (
          <div className="mb-4">
            <div className="font-semibold mb-1">Supervisor(s) Tagged for Review</div>
            <ul className="list-disc pl-6 text-sm">
              {taggedSupervisors.map(email => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-8 text-sm text-muted-foreground">If you have any questions, please contact our HR department.</div>
      </div>
      <div className="mt-8 text-right text-xs text-muted-foreground">This is a system-generated notice.</div>
    </div>
  );

  // Styled preview of the notice letter
  const renderNoticePreview = () => (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow border">
      <div className="mb-6">
        <div className="text-lg font-bold mb-1">Notice of Preliminary Decision</div>
        <div className="text-sm text-muted-foreground mb-2">Pre-Adverse Action Notice</div>
        <div className="text-xs text-muted-foreground">Date: {new Date().toLocaleDateString()}</div>
      </div>
      <div className="mb-6">
        <div className="mb-2"><span className="font-semibold">To:</span> {noticeData.applicantName || <span className="italic text-muted-foreground">[Candidate Name]</span>}</div>
        <div className="mb-2"><span className="font-semibold">Position:</span> {noticeData.position || <span className="italic text-muted-foreground">[Position Title]</span>}</div>
      </div>
      <div className="mb-6">
        <p className="mb-2">Dear Candidate,</p>
        <p className="mb-4">This notice is to inform you of a preliminary decision regarding your employment application. Please review the following information and your rights under the law.</p>
        <div className="mb-4">
          <div className="font-semibold mb-1">1. Conviction Record/History Report</div>
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cinnabar" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.07-7.07a4 4 0 00-5.657-5.657l-7.071 7.07a6 6 0 108.485 8.486L20.5 13" /></svg>
            <span className="text-sm text-cinnabar font-medium">Background_Check_Summary_Jacobi_Iverson.pdf</span>
            <span className="text-xs text-muted-foreground ml-2">(Background report attached)</span>
          </div>
          <div className="text-sm bg-gray-50 border rounded p-2 whitespace-pre-line">{noticeData.convictions || <span className="italic text-muted-foreground">No additional notes provided.</span>}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">2. The Disqualifying Conviction(s) and Explanation</div>
          <div className="text-sm bg-gray-50 border rounded p-2 whitespace-pre-line">
            {noticeData.selectedExceptions && noticeData.selectedExceptions.length > 0 ? (
              <ul className="list-disc pl-5">
                {noticeData.selectedExceptions.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            ) : (
              <span className="italic text-muted-foreground">No exception selected.</span>
            )}
            {noticeData.exceptionExplanation && (
              <div className="mt-2">{noticeData.exceptionExplanation}</div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">3. Applicant's Right to Respond</div>
          <ul className="list-disc pl-6 text-sm mb-2">
            <li>Challenge the accuracy of the conviction record</li>
            <li>Provide evidence of rehabilitation or mitigation</li>
            <li>Submit any other information you wish us to consider</li>
          </ul>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">4. Response Deadlines</div>
          <ul className="list-disc pl-6 text-sm">
            <li><span className="font-semibold">Chicago HRO & IHRA:</span> 5 business days to respond</li>
            <li><span className="font-semibold">EBFA:</span> 7 calendar days to respond</li>
          </ul>
          <div className="text-xs text-muted-foreground mt-1">No final adverse action will be taken until the applicable response period has passed.</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">5. EBFA Compliance Notice</div>
          <div className="text-sm">As required by the Employee Background Fairness Act (EBFA), we will notify you before or when filling the position if you are not selected for this role.</div>
        </div>
        <div className="mt-8 text-sm text-muted-foreground">If you have any questions, please contact our HR department.</div>
      </div>
      <div className="mt-8 text-right text-xs text-muted-foreground">This is a system-generated notice.</div>
    </div>
  );

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
              onClick={() => setShowPreviewNotice(true)}
            >
              Preview Notice
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

      {/* Preview Notice Modal */}
      <PreviewDialog open={showPreviewNotice} onOpenChange={setShowPreviewNotice}>
        <PreviewDialogContent className="max-w-3xl">
          <PreviewDialogHeader>
            <PreviewDialogTitle>Preview: Candidate Notice Letter</PreviewDialogTitle>
          </PreviewDialogHeader>
          <div className="overflow-y-auto max-h-[70vh]">{renderNoticePreview()}</div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowPreviewNotice(false)}>Close Preview</Button>
          </div>
        </PreviewDialogContent>
      </PreviewDialog>

      <Dialog open={showFinalNoticeDialog} onOpenChange={setShowFinalNoticeDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Final Notice of Decision</DialogTitle>
            <DialogDescription>
              Review and send the final notice of decision to revoke job offer.
            </DialogDescription>
          </DialogHeader>
          
          {renderFinalNoticeContent()}
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
              {/* Removed long legal text per user request */}
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded space-y-2 mt-4">
                <div className="font-semibold text-yellow-900 mb-2">Important Compliance Notice</div>
                <ul className="list-disc pl-6 text-sm text-yellow-900 space-y-1">
                  <li><span className="font-bold">Investigation by the Commission:</span> The Commission may investigate any alleged violations of this ordinance.</li>
                  <li><span className="font-bold">Penalties:</span> Unless another fine or penalty is specifically provided in this Code, any person who violates this ordinance as determined by this Commission shall be fined not less than <span className="font-bold">$5,000</span> and not more than <span className="font-bold">$10,000</span> for each offense.</li>
                  <li><span className="font-bold">License Discipline:</span> Violations may result in discipline or revocation of business or professional licenses.</li>
                  <li><span className="font-bold">Each New Day = New Offense:</span> Each new day that a violation continues shall constitute a separate and distinct offense.</li>
                  <li><span className="font-bold">Ongoing Violations:</span> Every day that a violation shall continue shall constitute a separate and distinct offense.</li>
                </ul>
              </div>
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

      <Dialog open={showExceptionModal} onOpenChange={setShowExceptionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>FOUR EXCEPTIONS</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-base">
            {exceptionOptions.map((option, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Checkbox
                  id={`exception-${idx}`}
                  checked={selectedExceptions.includes(option)}
                  onCheckedChange={(checked) => {
                    setSelectedExceptions(prev =>
                      checked ? [...prev, option] : prev.filter(o => o !== option)
                    );
                  }}
                />
                <label htmlFor={`exception-${idx}`} className="text-sm cursor-pointer select-none">
                  {option}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowExceptionModal(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}