"use client"

import { HeroSection } from "@/components/hero-section"
import { Icons } from "@/components/ui/icons"
import { SplashCursor } from "@/components/ui/splash-cursor"


export default function HeroSectionDemo() {
  return (
 
        <div className="flex flex-col min-h-screen">
         
     <main className="flex-grow m-0 p-0">
         <SplashCursor />
     <HeroSection
    
      badge={{
        text: "Introducing SnapShrinkAI",
        action: {
          text: "visit our app",
          href: "/home",
        },
      }}
      title="Your content. Every platform. Perfect fit."
      description="Seamlessly compress videos and auto-adjust images to every social platform's dimensions—no manual edits, no wasted time."
      actions={[
        {
          text: "Get Started",
          href: "/sign-in",
          variant: "default",
        },
        {
          text: "GitHub",
          href: "https://github.com/jas2609",
          variant: "glow",
          icon: <Icons.gitHub className="h-5 w-5" />,
        },
      ]}
     image={{
        light: "/homeimage.png",
        dark: "/homeimage.png",
        alt: "AI powered image and video resizing and compression for social media",
      }} 
    />
</main>


      
    </div>
  
    
  )
}
