"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, ClipboardList, CheckCircle2, FileText, AlertTriangle, ArrowRight, Scale } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const legalFrameworks = [
  {
    key: "illinois",
    label: "Illinois Human Rights Act",
    short: "Illinois",
    explainer: "The Illinois Human Rights Act prohibits most employers from using arrest records in employment decisions and requires an interactive assessment for disqualifying convictions.",
    requirements: [
      "Prohibits use of arrest records in employment decisions",
      "Allows sealed felony checks only as required by law",
      "Interactive assessment and written notice for disqualifying convictions",
      "Employee right to respond before final decision",
    ],
    button: "/ordinance/illinois-human-rights-act",
    buttonLabel: "View Full Illinois Human Rights Act",
  },
  {
    key: "cook",
    label: "Cook County Human Rights Ordinance",
    short: "Cook County",
    explainer: "Cook County's Human Rights Ordinance promotes compliant hiring practices by regulating how employers use arrest and conviction records in employment decisions.",
    requirements: [
      "Background checks only after conditional offer",
      "Individualized assessment required",
      "7-day candidate response period",
      "3-year record retention mandate",
    ],
    button: "/ordinance",
    buttonLabel: "View Full Cook County Human Rights Ordinance",
  },
  {
    key: "chicago",
    label: "Chicago Amended Ordinance",
    short: "Chicago",
    explainer: "Chicago's Human Rights Ordinance restricts employer use of arrest and conviction records, with additional local requirements for candidate notification and individualized assessment.",
    requirements: [
      "No inquiry into arrest record as basis for employment decisions",
      "Conviction record may only be used if substantially related to job duties or required by law",
      "Written notice and response period required before adverse action",
      "Consideration of rehabilitation and mitigating factors required",
    ],
    button: "/ordinance/chicago-amended",
    buttonLabel: "View Full Chicago Amended Ordinance",
  },
];

const steps = [
	{
		title: "Assessment",
		description: "Evaluate conviction history in relation to job duties.",
		icon: <ClipboardList className="w-6 h-6" />,
	},
	{
		title: "Candidate Response",
		description: "Allow candidate to respond or provide evidence.",
		icon: <User className="w-6 h-6" />,
	},
	{
		title: "Reassessment",
		description: "Review candidate input and reassess decision.",
		icon: <AlertTriangle className="w-6 h-6" />,
	},
	{
		title: "Final Decision",
		description: "Communicate the final employment decision.",
		icon: <CheckCircle2 className="w-6 h-6" />,
	},
];

export default function Home() {
	const router = useRouter();
	const [selectedFramework, setSelectedFramework] = React.useState("cook");
	const framework = legalFrameworks.find(f => f.key === selectedFramework) || legalFrameworks[0];

	return (
		<div className="min-h-screen bg-background font-poppins p-0">
			{/* Logo Bar */}
			<div className="flex items-center px-8 py-6">
				<Image
					src="/rezme-logo.png"
					alt="rézme logo"
					width={160}
					height={48}
					priority
				/>
			</div>
			{/* Legal Framework Selector */}
			<div className="flex justify-center mb-6">
				<ToggleGroup
					type="single"
					value={selectedFramework}
					onValueChange={val => val && setSelectedFramework(val)}
					className="bg-white border rounded-lg p-1 shadow-sm"
				>
					{legalFrameworks.map(f => (
						<ToggleGroupItem
							key={f.key}
							value={f.key}
							className={`px-4 py-2 font-poppins text-base ${selectedFramework === f.key ? 'bg-cinnabar text-white' : 'text-cinnabar'}`}
						>
							{f.label}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</div>
			<div className="mx-auto max-w-7xl space-y-8 px-8 pb-8">
				<h1 className="text-4xl font-bold text-foreground">
					Fair Chance Hiring Compliance Platform Demo: {" "}
					<span className="text-cinnabar capitalize">{framework.short}</span>
				</h1>
				<div className="flex gap-8">
					{/* Legal Overview Panel */}
					<Card className="bg-background text-foreground border border-border shadow-sm rounded-lg w-2/5 min-w-[320px] max-w-[480px] flex-shrink-0">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-foreground">
								<Scale className="h-5 w-5 text-cinnabar" />
								Fair Chance Ordinance Legal Overview
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-gray35">{framework.explainer}</p>
							<div className="space-y-2">
								<h3 className="font-semibold text-gray35">Key Requirements:</h3>
								<ul className="list-disc pl-5 space-y-1 text-sm text-foreground font-poppins">
									{framework.requirements.map((req, i) => (
										<li key={i}>{req}</li>
									))}
								</ul>
							</div>
							<Button
								variant="outline"
								className="w-full border-cinnabar text-cinnabar hover:bg-cinnabar hover:text-white transition font-poppins mb-2"
								onClick={() => router.push(framework.button)}
							>
								{framework.buttonLabel}
							</Button>
							<Button
								variant="outline"
								className="w-full border-cinnabar text-cinnabar hover:bg-cinnabar hover:text-white transition font-poppins"
								onClick={() => router.push("/ordinance/chicago-amended")}
							>
								View Full Chicago Amended Ordinance
							</Button>
							<Button
								variant="outline"
								className="w-full border-cinnabar text-cinnabar hover:bg-cinnabar hover:text-white transition font-poppins mt-0"
								onClick={() => router.push("/ordinance/illinois-human-rights-act")}
							>
								View Full Illinois Human Rights Act
							</Button>
						</CardContent>
					</Card>

					{/* Assessment Launch Panel */}
					<Card className="bg-background text-foreground border border-border shadow-sm rounded-lg w-3/5 max-w-none flex-shrink min-w-[400px]">
					  <CardHeader>
					    <CardTitle className="flex items-center gap-2 text-foreground">
					      <ClipboardList className="h-5 w-5 text-cinnabar" />
					      Launch Assessment Demo
					    </CardTitle>
					  </CardHeader>
					  <CardContent className="space-y-4">
					    <p className="text-gray35">
					      Start a structured workflow to evaluate conviction history in
					      compliance with Fair Chance requirements. This process will guide
					      you through:
					    </p>
					    {/* Steps Row (Icons + Arrows) */}
					    <div className="relative w-full mt-6">
					      {/* Grid for steps */}
					      <div
					        className="grid w-full"
					        style={{
					          gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
					          alignItems: "start",
					          gap: 0,
					        }}
					      >
					        {steps.map((step, idx) => (
					          <div key={step.title} className="flex flex-col items-center min-w-0">
					            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-cinnabar text-white">
					              {step.icon}
					            </div>
					            <span className="text-lg font-bold text-foreground text-center break-words leading-tight mt-2 max-w-[200px]">
					              {step.title}
					            </span>
					            <span className="text-sm text-gray35 text-center block max-w-[340px] mt-2">
					              {step.description}
					            </span>
					          </div>
					        ))}
					      </div>
					      {/* Absolutely positioned arrows */}
					      {steps.length > 1 && (
					        <div className="absolute left-0 top-0 w-full h-16 pointer-events-none">
					          <div className="flex h-16 w-full">
					            {steps.map((_, idx) =>
					              idx < steps.length - 1 ? (
					                <div
					                  key={idx}
					                  className="flex-1 flex items-center justify-center"
					                  style={{ position: "relative" }}
					                >
					                  <span
					                    className="absolute left-full top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-gray35 select-none"
					                    style={{ zIndex: 10 }}
					                  >
					                    &gt;
					                  </span>
					                </div>
					              ) : (
					                <div key={idx} className="flex-1" />
					              )
					            )}
					          </div>
					        </div>
					      )}
					    </div>
					    <Button
					      className="w-full bg-cinnabar text-white hover:bg-cinnabar-600 transition font-poppins"
					      onClick={() => router.push("/assessment")}
					    >
					      Begin New Assessment Demo
					    </Button>
					  </CardContent>
					</Card>
				</div>
				{/* Candidate Portal Card */}
				<Card className="mt-8 bg-background text-foreground border border-border shadow-sm rounded-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-foreground">
							<Users className="h-5 w-5 text-cinnabar" />
							Candidate Portal Demo: "The Restorative Record"
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-gray35">
							A dedicated portal for candidates to view, update, and share their
							restorative justice and rehabilitation records as part of the Fair
							Chance hiring process.
						</p>
						<Button
							asChild
							className="w-full border-cinnabar text-cinnabar hover:bg-cinnabar hover:text-white transition font-poppins"
							variant="outline"
						>
							<a
								href="https://cornell.restorativerecord.com/"
								target="_blank"
								rel="noopener noreferrer"
							>
								Demo The Restorative Record
							</a>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}