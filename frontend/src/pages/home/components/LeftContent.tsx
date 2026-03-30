import { Button } from '@/lib/components/ui/button';

type LeftContentProps = {
  setIsOpen: (isOpen: boolean) => void;
};

export default function LeftContent({ setIsOpen }: LeftContentProps) {
  return (
    <section className="h-full flex-[1.4] rounded-3xl border border-amber-200/70 bg-white/30 p-6 shadow-sm backdrop-blur-[2px]">
      <div className="flex h-full flex-col">
        <header className="mb-6">
          <p className="text-sm text-neutral-600">Drift Memory</p>
          <h1 className="text-2xl font-bold text-neutral-800">
            過去の自分から届いたメッセージ
          </h1>
        </header>

        <div className="flex-1 rounded-2xl border border-amber-200/80 bg-white/40 p-6">
          <p className="text-sm text-netutral-600">
            ここに過去投稿のランダム表示を置く
          </p>
        </div>

        <div className="mt-auto pt-6">
          <Button
            className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow"
            onClick={() => setIsOpen(true)}
          >
            Memoryを流す
          </Button>
        </div>
      </div>
    </section>
  );
}
