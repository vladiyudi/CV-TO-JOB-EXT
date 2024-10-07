import React from 'react'
import ShimmerButton from "@/components/ui/shimmer-button";
import { CoolMode } from "@/components/ui/cool-mode";

export default function NextStepButton({ handleSubmit, isLoading, text }) {
  return (
    <div className="button-container">
    <CoolMode>
    <ShimmerButton
      onClick={handleSubmit}
      disabled={isLoading}
      className="match-button rajdhani-light"
    >
      {isLoading ? 'Processing...' : text}
    </ShimmerButton>
    </CoolMode>
  </div>
  )
}
