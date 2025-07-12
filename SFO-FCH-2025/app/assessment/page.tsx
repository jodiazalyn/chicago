"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Upload, Phone, MessageSquare, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Image from "next/image";

interface RequiredDocument {
  type: "jobDescription" | "backgroundCheck" | "restorativeRecord";
  file: File | null;
  notes: string;
}

interface ContactOption {
  id: "call" | "message" | "request";
  selected: boolean;
}

export default function AssessmentIntake() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [documents, setDocuments] = useState<Record<string, RequiredDocument>>({
    jobDescription: { type: "jobDescription", file: null, notes: "" },
    backgroundCheck: { type: "backgroundCheck", file: null, notes: "" },
    restorativeRecord: { type: "restorativeRecord", file: null, notes: "" },
  });
  const [contactOptions, setContactOptions] = useState<ContactOption[]>([
    { id: "call", selected: false },
    { id: "message", selected: false },
    { id: "request", selected: false },
  ]);

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

  const handleFileChange = (type: keyof typeof documents) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments(prev => ({
        ...prev,
        [type]: { ...prev[type], file: e.target.files![0] }
      }));
    }
  };

  const handleNotesChange = (type: keyof typeof documents) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocuments(prev => ({
      ...prev,
      [type]: { ...prev[type], notes: e.target.value }
    }));
  };

  const toggleContactOption = (optionId: ContactOption["id"]) => {
    setContactOptions(prev => prev.map(option => ({
      ...option,
      selected: option.id === optionId ? !option.selected : option.selected
    })));

    const messages = {
      call: "An agent will contact the candidate within 24 hours to conduct the Fair Chance assessment interview.",
      message: "An agent will reach out to the candidate through our secure messaging channel within 2 hours.",
      request: "A request for restorative documentation has been sent to the candidate's email.",
    };

    toast({
      title: "Contact Option Selected",
      description: messages[optionId],
    });
  };

  const isComplete = Object.values(documents).every(doc => doc.file !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    toast({
      title: "Configuring your Fair Chance Compliance Protocol…",
      description: "Please wait while we prepare your assessment.",
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowSuccessModal(true);
    setIsLoading(false);
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    router.push("/assessment/evaluate");
  };

  return (
    <>
      {/* Place this at the top of your main return, before the main content */}
      <div className="fixed top-0 left-2 z-50 p-6">
        <Image
          src="/rezme-logo.png"
          alt="rézme logo"
          width={160}
          height={48}
          priority
        />

      </div>

      <div className="min-h-screen bg-background font-poppins p-8 pt-32">
        <div className="mx-auto max-w-4xl space-y-8">
          <Button 
            variant="ghost" 
            className="mb-4 ia-button-outline text-gray35 font-poppins"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 font-poppins">Assessment Intake</h1>
              <p className="ia-text text-gray35 mt-2">
                Please provide the following documentation to proceed with the Fair Chance Assessment.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <Card className="p-6 bg-card text-card-foreground border border-border shadow-sm rounded-lg">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground flex items-center gap-3 mb-6 font-poppins">
                  <FileText className="h-8 w-8 text-cinnabar" /> {/* Increased icon size */}
                  Upload Required Documentation
                </h2>

                <div className="space-y-8">
                  {/* Job Description Upload (read-only) */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="jobDescription" className="text-lg md:text-xl font-semibold text-foreground font-poppins">
                        1. Job Description
                      </Label>
                      <p className="ia-text text-gray35 mt-1">
                        Attach the job posting or internal job description for this role. This will help determine whether the offense is job-related as required by Chicago's Human Rights Ordinance.
                      </p>
                    </div>
                    <div className="grid gap-4">
                      <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-cinnabar" />
                          <p className="ia-text text-gray35 font-semibold">
                            {documents.jobDescription.file ? documents.jobDescription.file.name : "No file preloaded"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Background Check Upload (read-only) */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="backgroundCheck" className="text-lg md:text-xl font-semibold text-foreground font-poppins">
                        2. Background Check Report
                      </Label>
                      <p className="ia-text text-gray35 mt-1">
                        Upload the candidate's background check results that triggered this individualized assessment. The system will ensure only permissible data is considered.
                      </p>
                    </div>
                    <div className="grid gap-4">
                      <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-cinnabar" />
                          <p className="ia-text text-gray35 font-semibold">
                            {documents.backgroundCheck.file ? documents.backgroundCheck.file.name : "No file preloaded"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Restorative Record Upload (read-only) */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="restorativeRecord" className="text-lg md:text-xl font-semibold text-foreground font-poppins">
                        3. Restorative Record or Candidate Response
                      </Label>
                      <p className="ia-text text-gray35 mt-1">
                        If the candidate submitted documentation regarding rehabilitation, mitigating factors, or inaccuracies, upload it here. This is required before making any adverse decision.
                      </p>
                    </div>
                    <div className="grid gap-4">
                      <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-cinnabar" />
                          <p className="ia-text text-gray35 font-semibold">
                            {documents.restorativeRecord.file ? documents.restorativeRecord.file.name : "No file preloaded"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-6">
                    <p className="ia-text text-foreground font-semibold mb-3 text-lg">
                      Alternative Contact Options:
                    </p>
                    <div className="flex flex-col gap-4">
                      <div className="space-y-3">
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full justify-start ia-button-outline font-poppins border border-border ${contactOptions.find(o => o.id === "call")?.selected ? "border-cinnabar text-cinnabar bg-cinnabar/10" : ""}`}
                          onClick={() => toggleContactOption("call")}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Schedule Assessment Call
                        </Button>
                        {contactOptions.find(o => o.id === "call")?.selected && (
                          <div className="ia-text text-gray35 pl-4 border-l-2">
                            An agent will conduct a structured interview with the candidate following our Fair Chance assessment protocol. The call will be scheduled within 24 hours.
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full justify-start ia-button-outline font-poppins border border-border ${contactOptions.find(o => o.id === "message")?.selected ? "border-cinnabar text-cinnabar bg-cinnabar/10" : ""}`}
                          onClick={() => toggleContactOption("message")}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Secure Message
                        </Button>
                        {contactOptions.find(o => o.id === "message")?.selected && (
                          <div className="ia-text text-gray35 pl-4 border-l-2">
                            An agent will reach out through our secure messaging platform to gather information about rehabilitation and mitigating factors. Response typically within 2 hours.
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full justify-start ia-button-outline font-poppins border border-border ${contactOptions.find(o => o.id === "request")?.selected ? "border-cinnabar text-cinnabar bg-cinnabar/10" : ""}`}
                          onClick={() => toggleContactOption("request")}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Request Restorative Record
                        </Button>
                        {contactOptions.find(o => o.id === "request")?.selected && (
                          <div className="ia-text text-gray35 pl-4 border-l-2">
                            Send an automated email request to the candidate for documentation of rehabilitation, training certificates, or character references.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={!isComplete || isLoading}
                    className="ia-button-primary bg-cinnabar text-white hover:bg-cinnabar-600 font-poppins px-4 py-2 rounded-md text-base transition"
                  >
                    {isLoading ? "Processing..." : "Continue"}
                  </Button>
                </div>
              </Card>
            </form>
          </div>
        </div>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="max-w-2xl md:max-w-3xl h-[80vh] overflow-y-auto font-poppins rounded-xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-poppins">
                Protocol Compiled Successfully
              </DialogTitle>
              <DialogDescription className="space-y-6 pt-2 ia-text text-gray-700">
                <div className="bg-muted p-4 rounded-lg border border-cinnabar">
                  <p>
                    All materials have been ingested to power your real-time intelligence system. You're about to review <span className="font-bold text-foreground">Jacobi Iverson</span> for a Sales Associate role located in <span className="font-bold text-foreground">Chicago, IL</span> that is governed by the <span className="font-bold text-foreground">Chicago Human Rights Ordinance</span>. We will walk you through an individualized assessment informed by your company policy, applicable laws, and background check data that has been ingested to create your hiring protocol and agentic workflows. Below you will find a summary of the background report and the job requisition you are looking to fill at your organization:
                  </p>
                </div>
                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <button className="w-full text-left font-semibold text-foreground mt-2 bg-primary/10 p-4 rounded-lg ia-heading-3 border border-border transition hover:bg-cinnabar/10">
                      Background Check Summary
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="bg-primary/10 p-4 rounded-b-lg border-b border-x border-border">
                      <ul className="list-disc pl-6 space-y-2 ia-text">
                        <li>Conviction: Possession with Intent to Sell a Controlled Substance (Class B felony)</li>
                        <li>Date of Conviction: May 12, 2018</li>
                        <li>Jurisdiction: Kings County, NY</li>
                        <li>Sentence: Indeterminate 1–9 years; served four years in state custody (June 2019 – June 2023)</li>
                        <li>Release & Supervision: Paroled in June 2023; completed all parole and probation requirements by May 2025</li>
                        <li>Parole Violation: One curfew violation recorded in September 2023; resulted in a formal warning and no further sanctions</li>
                      </ul>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <button className="w-full text-left font-semibold text-foreground mt-2 bg-secondary p-4 rounded-lg ia-heading-3 border border-border transition hover:bg-cinnabar/10">
                      Job Requisition: Entry‑Level Sales Associate
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="bg-secondary p-4 rounded-b-lg border-b border-x border-border">
                      <p className="font-semibold mt-2 ia-text">Position Overview:</p>
                      <p className="ia-text">
                        The Entry‑Level Sales Associate will support sales initiatives by engaging prospects, presenting product information, and assisting with day‑to‑day sales activities. This role includes structured training, mentorship, and opportunities for professional growth.
                      </p>
                      <p className="font-semibold mt-2 ia-text">Key Responsibilities:</p>
                      <ul className="list-disc pl-6 space-y-2 ia-text">
                        <li>Prospect and qualify leads through outreach and inbound inquiries</li>
                        <li>Conduct product demonstrations and articulate value propositions</li>
                        <li>Maintain and update CRM records with accurate opportunity and pipeline data</li>
                        <li>Collaborate with marketing and customer success teams to ensure seamless customer experiences</li>
                        <li>Meet or exceed individual sales targets and contribute to team goals</li>
                      </ul>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <button className="w-full text-left font-semibold text-foreground mt-2 bg-muted p-4 rounded-lg ia-heading-3 border border-border transition hover:bg-cinnabar/10">
                      What Happens Next
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="bg-muted p-4 rounded-b-lg border-b border-x border-border">
                      <ul className="list-disc pl-6 space-y-2 ia-text">
                        <li>Your reviewers can now begin conducting individualized assessments with intelligent support from your own policies</li>
                        <li>As they evaluate candidates with criminal histories, relevant guidance from your uploaded documents will automatically appear</li>
                        <li>Each assessment question will be accompanied by applicable content from your policies, ensuring compliance with both the Fair Chance Ordinance and your internal protocols</li>
                      </ul>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end mt-4">
              <Button
                className="ia-button-primary bg-cinnabar text-white hover:bg-cinnabar-600 font-poppins px-6 py-2 rounded-md text-base transition"
                onClick={handleContinue}
              >
                Begin Assessment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}