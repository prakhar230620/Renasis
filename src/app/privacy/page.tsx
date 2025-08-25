
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }, []);

    const sections = [
        {
            title: "1. Introduction",
            content: "Welcome to RENASIS. We are committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our Service. As our service is open-access and does not require user accounts, we collect minimal information."
        },
        {
            title: "2. Information We Do Not Collect",
            content: "We do not require you to create an account, so we do not collect personal identification information like your name, email address, or phone number. We do not use cookies for tracking or advertising purposes."
        },
        {
            title: "3. Information You Provide",
            content: "You may upload files containing customer reviews and provide your own Google AI API keys. Review data is processed in-memory for analysis during your active session and is never saved on our servers. Your API keys are stored locally on your device using browser storage and are never transmitted to or stored on our servers. The analysis is performed using your own Google AI API keys directly with Google's services."
        },
        {
            title: "4. How We Use Information",
            content: "The content of the files you upload is used solely to provide you with AI-driven analytics. Your data is processed using your own Google AI API keys, ensuring you maintain full control over your data. We do not store, access, or use your data for any other purpose beyond the immediate analysis session."
        },
        {
            title: "5. Data Security",
            content: "Your API keys are stored securely in your browser's local storage and never leave your device except when used to make direct API calls to Google's services. Review data is processed in-memory only during your session. We implement reasonable security measures, but no method of transmission is 100% secure. You maintain full control over your API keys and can remove them at any time."
        },
        {
            title: "6. Third-Party Services",
            content: "Our Service connects directly to Google AI services using your provided API keys. When you use the service, your review data is sent directly from your browser to Google's servers for processing. We recommend reviewing Google's privacy policy to understand how they handle your data during processing."
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
                    <div className="relative text-center">
                        <Link href="/" passHref>
                            <Button variant="outline" className="absolute left-0 top-1/2 -translate-y-1/2">
                                <ArrowLeft className="mr-2" />
                                Back to Home
                            </Button>
                        </Link>
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
