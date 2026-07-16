import Image from "next/image";

export default function StaffCard({ name, role, bio, img }: { name: string, role: string, bio: string, img: string }) {
  return (
    <div className="bg-white dark:bg-[#2a2a2a] p-6 border border-black/10 dark:border-white/10 shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative aspect-square w-full mb-6 bg-stone-200 dark:bg-[#333333]">
        <Image src={img} alt={name} fill className="object-cover" sizes="300px" />
      </div>
      <h3 className="text-xl font-black uppercase tracking-tighter mb-1">{name}</h3>
      <p className="text-[#FFB81C] font-bold uppercase tracking-widest text-[10px] mb-4">{role}</p>
      <p className="text-sm leading-relaxed text-stone-700 dark:text-[#d1d1d1]">{bio}</p>
    </div>
  );
}
