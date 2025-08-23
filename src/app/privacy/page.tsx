'use client';

import { useState, useEffect } from 'react';

export default function PrivacyPage() {
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }, []);

    const sections = [
        {
            title: "1. Introduction",
            content: "Welcome to Review Insights AI. We are committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our Service. As our service is open-access and does not require user accounts, we collect minimal information."
        },
        {
            title: "2. Information We Do Not Collect",
            content: "We do not require you to create an account, so we do not collect personal identification information like your name, email address, or phone number. We do not use cookies for tracking or advertising purposes."
        },
        {
            title: "3. Information You Provide",
            content: "You may upload files containing customer reviews. This data is processed in-memory for analysis during your active session. We do not save, store, or share the content of your uploaded files on our servers after your session is terminated. The analysis is performed by third-party AI services (e.g., Google Gemini), and the data is subject to their respective privacy policies."
        },
        {
            title: "4. How We Use Information",
            content: "The content of the files you upload is used solely to provide you with the AI-driven analytics that are part of the Service. The data is sent to our AI partners for processing and is not used for any other purpose."
        },
        {
            title: "5. Data Security",
            content: "We implement reasonable security measures to protect the data during your session. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security."
        },
        {
            title: "6. Third-Party Services",
            content: "Our Service uses third-party AI providers to perform analysis. We recommend you review the privacy policies of these providers to understand how they handle data."
        },
        {
            title: "7. Changes to This Privacy Policy",
            content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes."
        },
        {
            title: "8. Contact Us",
            content: "If you have any questions about this Privacy Policy, please contact us at privacy@reviewinsights.ai."
        }
    ];

    return (
        <div className="bg-background">
            <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="space-y-10">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy Policy</h1>
                        {lastUpdated && <p className="mt-4 text-lg text-muted-foreground">Last updated: {lastUpdated}</p>}
                    </div>

                    <div className="space-y-8 rounded-lg border bg-card p-6 text-card-foreground shadow-sm md:p-10">
                        {sections.map((section, index) => (
                            <section key={index}>
                                <h2 className="text-2xl font-bold text-primary">{section.title}</h2>
                                <p className="mt-2 leading-relaxed text-muted-foreground">{section.content}</p>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
