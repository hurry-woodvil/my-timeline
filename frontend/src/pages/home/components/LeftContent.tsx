import { Button } from '@/lib/components/ui/button';

type LeftContentProps = {
  setIsOpen: (isOpen: boolean) => void;
};

export default function LeftContent({ setIsOpen }: LeftContentProps) {
  return (
    <section className="relative flex min-h-0 flex-[1.6] flex-col overflow-hidden rounded-[2rem] px-6 pt-6 pb-24">
      <header className="mb-6">
        <p className="text-sm text-neutral-700/80">Drift Memory</p>
        <h1 className="text-2xl font-bold text-neutral-800">
          過去の自分から届いたメッセージ
        </h1>
      </header>

      <div className="flex-1 rounded-[1.75rem] bg-white/20 p-6 backdrop-blur-[1px]">
        <p className="text-sm text-netutral-700">
          ここに過去投稿のランダム表示を置く
        </p>
      </div>

      <div className="absolute bottom-6 left-6">
        <Button
          className="rounded-full bg-neutral-900 px-6 text-white shadow-md hover:bg-neutral-800"
          onClick={() => setIsOpen(true)}
        >
          Memoryを流す
        </Button>
      </div>
    </section>
  );
}
