"use client";

import { useState } from "react";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useBrands, useTeamLabels } from "@/hooks/useApi";

type AddStaffModalProps = {
  onClose: () => void;
  onAddStaff: (newStaff: import("@/types/api").StaffMember) => void;
};

export default function AddStaffModal({ onClose, onAddStaff }: AddStaffModalProps) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [teamKey, setTeamKey] = useState("");
  const [brandId, setBrandId] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"Nam" | "Ná»¯" | "KhÃ¡c">("Nam");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { labels: teamOptions } = useTeamLabels();
  const { brands: brandOptions } = useBrands();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newStaff = {
      id,
      name,
      role,
      shift: "N/A",
      teamKey: teamKey || null,
      brandId,
      permissions: ["Truy cập cơ bản"],
      status: "Đang làm",
      dob,
      gender,
      address,
      phone,
      email,
    };
    onAddStaff(newStaff);
    setIsSuccess(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-slate-900/75">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative w-full max-w-2xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <button type="button" onClick={onClose} className="absolute top-4 right-4 rounded-full p-1 text-slate-500 hover:bg-slate-100">
            <XMarkIcon className="h-6 w-6" />
          </button>
          <h3 className="text-xl font-semibold leading-6 text-slate-900">ThÃªm nhÃ¢n viÃªn má»›i</h3>
          {isSuccess ? (
            <div className="mt-6 flex h-96 flex-col items-center justify-center text-center">
              <CheckCircleIcon className="h-16 w-16 text-emerald-500" />
              <p className="mt-4 text-lg font-medium text-slate-800">Táº¡o tÃ i khoáº£n thÃ nh cÃ´ng!</p>
              <p className="mt-1 text-sm text-slate-600">ThÃ´ng tin nhÃ¢n viÃªn Ä‘Ã£ Ä‘Æ°á»£c thÃªm vÃ o há»‡ thá»‘ng.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">TÃªn nhÃ¢n viÃªn</label>
                  <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-xl border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200" required />
                </div>
                <div>
                  <label htmlFor="id" className="block text-sm font-medium text-slate-700">MÃ£ nhÃ¢n viÃªn</label>
                  <input type="text" name="id" id="id" value={id} onChange={(e) => setId(e.target.value)} placeholder="VD: EMP-1234" className="mt-1 block w-full rounded-xl border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200" required />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-slate-700">NgÃ y sinh</label>
                  <input type="date" name="dob" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 block w-full rounded-xl border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200" />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-slate-700">Giá»›i tÃ­nh</label>
                  <select id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value as "Nam" | "Ná»¯" | "KhÃ¡c")} className="mt-1 block w-full rounded-xl border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200">
                    <option>Nam</option>
                    <option>Ná»¯</option>
                    <option>KhÃ¡c</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700">Äá»‹a chá»‰</label>
                <input type="text" name="address" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full rounded-xl border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200" />
              </div>

              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Sá»‘ Ä‘iá»‡n thoáº¡i</label>
                  <input type="tel" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full rounded-xl border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                  <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-xl border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200" />
                </div>
              </div>

              <hr className="border-slate-200" />

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700">Vai trÃ² / Chá»©c vá»¥</label>
                <input type="text" name="role" id="role" value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full rounded-xl border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200" required />
              </div>

              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="team" className="block text-sm font-medium text-slate-700">Tá»• sáº£n xuáº¥t</label>
                  <select id="team" name="team" value={teamKey} onChange={(e) => setTeamKey(e.target.value)} className="mt-1 block w-full rounded-xl border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200">
                    <option value="">ChÆ°a gÃ¡n</option>
                    {teamOptions.map((team) => (
                      <option key={team.key} value={team.key}>{team.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-slate-700">ThÆ°Æ¡ng hiá»‡u phá»¥ trÃ¡ch</label>
                  <select id="brand" name="brand" value={brandId} onChange={(e) => setBrandId(e.target.value)} className="mt-1 block w-full rounded-xl border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200" required>
                    <option value="" disabled>Chá»n thÆ°Æ¡ng hiá»‡u</option>
                    {brandOptions.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">Há»§y</button>
                <button type="submit" className="rounded-full border border-transparent bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">Táº¡o tÃ i khoáº£n</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


