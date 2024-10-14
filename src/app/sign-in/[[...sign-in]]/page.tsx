import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center w-[100dvw] h-[100dvh]">
      <SignIn forceRedirectUrl='/dashboard' />
    </div>
  )
}