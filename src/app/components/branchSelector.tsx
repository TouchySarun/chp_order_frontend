import { getBranches } from "@/lib/global";
import React, { useEffect, useState } from "react";

interface BranchSelectorProps {
  onClose: () => void;
  selectedBranches?: string[];
  setSelectedBranches?: (branches: string[]) => void;
}

const BranchSelector = ({
  onClose,
  selectedBranches: hasBeenSelectedBranches = [],
  setSelectedBranches: setHasBeenSelectedBranches,
}: BranchSelectorProps) => {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    hasBeenSelectedBranches
  );
  const [branches, setBranches] = useState<string[]>([]);

  const handleGetBranches = async () => {
    const res = await getBranches();
    if ("error" in res) {
      alert(res.error);
      return;
    }
    setBranches(res);
  };
  useEffect(() => {
    handleGetBranches();
  }, []);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checking = e.target.value;
    const temp = selectedBranches.filter((br) => br != checking);
    if (temp.length === selectedBranches.length) {
      setSelectedBranches([...selectedBranches, checking]);
    } else {
      setSelectedBranches(temp);
    }
  };

  const handleClose = (force: boolean) => {
    if (!setHasBeenSelectedBranches) return;
    if (!force) {
      if (window.confirm("ยกเลิกข้อมูลที่บันทึก?")) {
        onClose();
        return;
      }
    }
    setHasBeenSelectedBranches(selectedBranches);
    onClose();
  };
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>

      <div className="fixed inset-0 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="w-full relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="w-full">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h3
                      className="text-xl font-semibold leading-6 text-gray-900"
                      id="modal-title"
                    >
                      เลือกสาขา{" "}
                      <span className="text-gray-400 text-sm">
                        (เลือกอยู่ {selectedBranches.length} สาขา)
                      </span>
                    </h3>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => handleClose(false)}
                    >
                      ยกเลิก
                    </button>
                  </div>
                  <div className="p-2 rounded-md border flex flex-col gap-2">
                    <div className=" h-[400px] overflow-scroll">
                      {branches.map((br) => (
                        <label
                          key={`br_${br}`}
                          htmlFor={`br_${br}`}
                          className="flex gap-2 p-2" // todo change to grid & col
                        >
                          <input
                            type="checkbox"
                            id={`br_${br}`}
                            name="aps"
                            value={br}
                            checked={selectedBranches.some((a) => a === br)}
                            onChange={handleCheck}
                          />
                          <p>{br}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col px-4 py-3">
              <button
                className="text-white text-lg p-2 bg-green-500 rounded-md shadow-md"
                onClick={() => handleClose(true)}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchSelector;
