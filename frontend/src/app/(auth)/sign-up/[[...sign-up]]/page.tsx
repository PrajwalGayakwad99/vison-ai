import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: '#14131A' }}>
      <SignUp
        appearance={{
          elements: {
            rootBox: 'flex flex-col items-center',
            card: 'rounded-2xl shadow-2xl',
          },
        }}
      />
    </div>
  );
}
