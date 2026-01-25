"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/Button"
import { Check, Copy, Share2, X } from "lucide-react"

interface CopyLinkButtonProps {
    url: string
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
    const [copied, setCopied] = useState(false)
    const [failed, setFailed] = useState(false)
    const [canShare, setCanShare] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
        }, 0)
        return () => clearTimeout(timeout)
    }, [])

    const copyToClipboard = async () => {
        setFailed(false)
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy!", err)
            setFailed(true)
            setTimeout(() => setFailed(false), 3000)
        }
    }

    const shareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Valentine's Invitation",
                    text: "You've received a special invitation! 💌",
                    url: url,
                })
            } catch (err) {
                console.error("Error sharing:", err)
            }
        } else {
            copyToClipboard()
        }
    }

    return (
        <div className="flex gap-2 w-full mt-4">
            <Button
                variant="primary"
                className="flex-1 gap-2"
                onClick={copyToClipboard}
            >
                {copied ? (
                    <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                    </>
                ) : failed ? (
                    <>
                        <X className="h-4 w-4" />
                        <span>Try again</span>
                    </>
                ) : (
                    <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Link</span>
                    </>
                )}
            </Button>
            {canShare && (
                <Button
                    variant="outline"
                    className="aspect-square p-0 w-10 h-10"
                    onClick={shareLink}
                >
                    <Share2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}
