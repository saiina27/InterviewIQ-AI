
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const features = [
    {
        number: "01",
        title: "Resume Analysis",
        description:
            "Upload your resume and receive an AI-assisted analysis with an ATS-style score, skill insights and areas that need improvement."
    },
    {
        number: "02",
        title: "Career Role Prediction",
        description:
            "Explore suitable career roles based on the skills, experience and information identified in your resume."
    },
    {
        number: "03",
        title: "Skill Gap Insights",
        description:
            "Understand which skills are relevant to your target role and identify areas where you can improve."
    },
    {
        number: "04",
        title: "AI Mock Interviews",
        description:
            "Practise personalized interview questions with text and voice-based interview experiences."
    },
    {
        number: "05",
        title: "Answer Evaluation",
        description:
            "Get AI-generated feedback on your interview answers, including strengths and opportunities to improve."
    },
    {
        number: "06",
        title: "Interview Reports",
        description:
            "Review your interview performance and access downloadable PDF reports to track your preparation."
    }
];

const steps = [
    {
        number: "01",
        title: "Upload your resume",
        description:
            "Start by uploading your resume in PDF format."
    },
    {
        number: "02",
        title: "Understand your profile",
        description:
            "Explore resume insights, role predictions and skill gaps."
    },
    {
        number: "03",
        title: "Practise interviews",
        description:
            "Attempt personalized mock interviews and submit your answers."
    },
    {
        number: "04",
        title: "Review your progress",
        description:
            "Read answer feedback and use your reports to improve."
    }
];

function Home() {
    return (
        <>
            <SEO
                title="InterviewIQ AI | Resume Analysis & AI Mock Interviews"
                description="Analyze your resume, explore suitable career roles, identify skill gaps and practise personalized AI mock interviews with InterviewIQ AI."
            />

            <div className="min-h-screen bg-[#f5f7fb] text-gray-900">

                {/* Navigation */}
                <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
                    <nav
                        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
                        aria-label="Main navigation"
                    >
                        <Link
                            to="/"
                            className="text-2xl font-extrabold tracking-tight text-indigo-700"
                        >
                            InterviewIQ AI
                        </Link>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                                Log in
                            </Link>

                            <Link
                                to="/signup"
                                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                Get Started
                            </Link>
                        </div>
                    </nav>
                </header>

                <main>

                    {/* Hero */}
                    <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

                        <div>
                            <p className="mb-5 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                                AI-powered interview preparation
                            </p>

                            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                Your resume is the starting point.
                                <span className="text-indigo-600">
                                    {" "}Your next interview is the goal.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                                InterviewIQ AI helps you understand your resume,
                                explore career opportunities, identify skill gaps
                                and practise personalized mock interviews — all
                                in one place.
                            </p>

                            <div className="mt-9 flex flex-wrap gap-4">
                                <Link
                                    to="/signup"
                                    className="rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                                >
                                    Start Preparing
                                </Link>

                                <a
                                    href="#how-it-works"
                                    className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
                                >
                                    How It Works
                                </a>
                            </div>

                            <p className="mt-5 text-sm text-gray-500">
                                Resume insights · Personalized practice ·
                                Actionable feedback
                            </p>
                        </div>

                        {/* Product overview panel */}
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Your preparation workspace
                                    </p>
                                    <h2 className="mt-1 text-xl font-bold">
                                        Interview readiness
                                    </h2>
                                </div>

                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                    AI-assisted
                                </span>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="rounded-2xl bg-indigo-50 p-5">
                                    <p className="text-sm font-semibold text-indigo-700">
                                        Resume insights
                                    </p>
                                    <p className="mt-2 text-gray-700">
                                        Understand your skills, experience
                                        and resume strengths.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-2xl bg-gray-50 p-5">
                                        <p className="text-sm font-semibold text-gray-800">
                                            Role fit
                                        </p>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Explore relevant career roles.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-gray-50 p-5">
                                        <p className="text-sm font-semibold text-gray-800">
                                            Skill gaps
                                        </p>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Find areas to improve.
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-200 p-5">
                                    <p className="text-sm font-semibold text-gray-800">
                                        Mock interview practice
                                    </p>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Practise questions and review
                                        AI-generated answer feedback.
                                    </p>
                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                                        <div className="h-full w-3/4 rounded-full bg-indigo-500" />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400">
                                        A visual preview of the preparation workflow
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section
                        id="features"
                        className="border-y border-gray-200 bg-white py-20"
                    >
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <p className="font-semibold text-indigo-600">
                                    WHAT YOU CAN DO
                                </p>

                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                    More than a basic resume checker
                                </h2>

                                <p className="mt-5 leading-7 text-gray-600">
                                    Move from understanding your profile to
                                    practising interviews and reviewing your
                                    performance.
                                </p>
                            </div>

                            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {features.map((feature) => (
                                    <article
                                        key={feature.number}
                                        className="rounded-2xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                                    >
                                        <span className="text-sm font-bold text-indigo-600">
                                            {feature.number}
                                        </span>

                                        <h3 className="mt-4 text-xl font-bold">
                                            {feature.title}
                                        </h3>

                                        <p className="mt-3 leading-7 text-gray-600">
                                            {feature.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Workflow */}
                    <section
                        id="how-it-works"
                        className="py-20"
                    >
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <p className="font-semibold text-indigo-600">
                                    THE WORKFLOW
                                </p>

                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                    From resume to interview practice
                                </h2>

                                <p className="mt-5 leading-7 text-gray-600">
                                    A structured preparation journey that helps
                                    you understand where you stand and what
                                    to work on next.
                                </p>
                            </div>

                            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {steps.map((step) => (
                                    <article key={step.number}>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
                                            {step.number}
                                        </div>

                                        <h3 className="mt-5 text-lg font-bold">
                                            {step.title}
                                        </h3>

                                        <p className="mt-3 leading-7 text-gray-600">
                                            {step.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Responsible integrity signals */}
                    <section className="border-y border-gray-200 bg-white py-20">
                        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
                            <div>
                                <p className="font-semibold text-indigo-600">
                                    INTERVIEW INTEGRITY
                                </p>

                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                    Additional signals for interview review
                                </h2>

                                <p className="mt-5 leading-8 text-gray-600">
                                    InterviewIQ AI includes browser tab-switch
                                    event tracking and webcam-based face
                                    detection during supported interview
                                    sessions.
                                </p>

                                <p className="mt-4 leading-8 text-gray-600">
                                    These are limited integrity signals that
                                    can provide additional context during
                                    review. They do not independently prove
                                    misconduct or cheating.
                                </p>
                            </div>

                            <div className="rounded-3xl bg-indigo-50 p-8">
                                <div className="space-y-5">
                                    <div className="rounded-xl bg-white p-5 shadow-sm">
                                        <p className="font-semibold text-gray-900">
                                            Browser activity
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-gray-600">
                                            Records supported tab-switch events
                                            during an interview session.
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-white p-5 shadow-sm">
                                        <p className="font-semibold text-gray-900">
                                            Webcam face detection
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-gray-600">
                                            Provides face-detection signals
                                            during supported sessions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="py-20">
                        <div className="mx-auto max-w-4xl px-6 lg:px-8">
                            <div className="text-center">
                                <p className="font-semibold text-indigo-600">
                                    FAQ
                                </p>

                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                                    Frequently asked questions
                                </h2>
                            </div>

                            <div className="mt-10 divide-y divide-gray-200">
                                <article className="py-6">
                                    <h3 className="text-lg font-bold">
                                        What is InterviewIQ AI?
                                    </h3>
                                    <p className="mt-3 leading-7 text-gray-600">
                                        InterviewIQ AI is an interview
                                        preparation platform that combines
                                        resume analysis, career role insights,
                                        personalized mock interviews and
                                        AI-generated performance feedback.
                                    </p>
                                </article>

                                <article className="py-6">
                                    <h3 className="text-lg font-bold">
                                        What kind of resume can I upload?
                                    </h3>
                                    <p className="mt-3 leading-7 text-gray-600">
                                        You can upload your resume in PDF
                                        format for supported resume analysis.
                                    </p>
                                </article>

                                <article className="py-6">
                                    <h3 className="text-lg font-bold">
                                        Can I practise interviews for different roles?
                                    </h3>
                                    <p className="mt-3 leading-7 text-gray-600">
                                        InterviewIQ AI uses your resume and
                                        selected role context to support
                                        personalized mock interview practice.
                                    </p>
                                </article>

                                <article className="py-6">
                                    <h3 className="text-lg font-bold">
                                        Does the platform guarantee a job or ATS selection?
                                    </h3>
                                    <p className="mt-3 leading-7 text-gray-600">
                                        No. Resume scores and AI-generated
                                        insights are preparation aids. They
                                        do not guarantee recruiter selection,
                                        job placement or a particular ATS result.
                                    </p>
                                </article>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="bg-indigo-700 py-16 text-white">
                        <div className="mx-auto max-w-4xl px-6 text-center">
                            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Prepare with more clarity.
                            </h2>

                            <p className="mx-auto mt-5 max-w-2xl leading-7 text-indigo-100">
                                Understand your resume, practise your answers
                                and take the next step in your interview
                                preparation.
                            </p>

                            <Link
                                to="/signup"
                                className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 font-bold text-indigo-700 transition hover:bg-indigo-50"
                            >
                                Get Started with InterviewIQ AI
                            </Link>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-gray-950 py-8 text-gray-300">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm sm:flex-row lg:px-8">
                        <p>
                            © {new Date().getFullYear()} InterviewIQ AI.
                            All rights reserved.
                        </p>

                        <div className="flex gap-5">
                            <Link
                                to="/login"
                                className="transition hover:text-white"
                            >
                                Log in
                            </Link>

                            <Link
                                to="/signup"
                                className="transition hover:text-white"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default Home;
