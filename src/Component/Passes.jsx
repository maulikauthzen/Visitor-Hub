import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, CircleDollarSign, Pencil, Plus, Ticket, Trash2, Users, X } from "lucide-react";

const emptyPass = {
  name: "",
  description: "",
  price: "",
  totalSlots: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function Passes() {
  const { id } = useParams();

  const [state, setState] = useState(null);

  const [pass, setPass] = useState(emptyPass);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    getpass();
  }, [id]);

  function getpass() {
    const token = localStorage.getItem("token");
    axios
      .get(`http://192.168.1.64:3000/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setState(res.data);
        console.log(res.data)
      });
  }

  function addpass() {
    const token = localStorage.getItem("token");

    axios
      .post(
        `http://192.168.1.64:3000/events/${id}/passes`,
        {
          name: pass.name,
          description: pass.description,
          price: Number(pass.price),
          totalSlots: Number(pass.totalSlots),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log("Pass added:", res.data);
        setPass(emptyPass);
        getpass();
      });
  }

  function deletepass(passId, eventId = id) {
    console.log("passId , eventId", passId, eventId);
    const token = localStorage.getItem("token");
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pass?",
    );

    if (!confirmDelete) {
      return;
    }
    axios
      .delete(`http://192.168.1.64:3000/events/${eventId}/passes/${passId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        getpass();
      });
  }

  function updatepass(passId) {
    const confirmUpdate = window.confirm(
      "Are you sure you want to update this pass?",
    );

    if (!confirmUpdate) {
      return;
    }
    const token = localStorage.getItem("token");

    axios
      .patch(
        `http://192.168.1.64:3000/events/${id}/passes/${passId}`,
        {
          name: pass.name,
          description: pass.description,
          price: Number(pass.price),
          totalSlots: Number(pass.totalSlots),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log("Pass updated:", res.data);

        getpass();

        setEdit(null);

        setPass(emptyPass);
      })
      .catch((error) => {
        console.log(
          "Update pass error:",
          error.response?.status,
          error.response?.data || error.message,
        );
      });
  }

  function editpass(el) {
    setPass({
      name: el.name,
      description: el.description,
      price: el.price,
      totalSlots: el.totalSlots,
    });
    setEdit(el.id);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <Ticket size={14} /> Pass management
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {state?.name || "Event passes"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
            {state?.description || "Create and manage passes for this event."}
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(280px,0.75fr)_minmax(0,1.6fr)] lg:gap-8">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {edit ? "Edit pass" : "New pass"}
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {edit ? "Update details" : "Create a pass"}
                </h2>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                {edit ? <Pencil size={18} /> : <Plus size={19} />}
              </span>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Pass name
                <input
                  type="text"
                  placeholder="e.g. General admission"
                  value={pass.name}
                  onChange={(e) => setPass({ ...pass, name: e.target.value })}
                  className={`${inputClass} mt-1.5`}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Description
                <textarea
                  placeholder="What does this pass include?"
                  value={pass.description}
                  onChange={(e) =>
                    setPass({ ...pass, description: e.target.value })
                  }
                  rows={3}
                  className={`${inputClass} mt-1.5 resize-y`}
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Price (INR)
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={pass.price}
                    onChange={(e) => setPass({ ...pass, price: e.target.value })}
                    className={`${inputClass} mt-1.5`}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Total slots
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    value={pass.totalSlots}
                    onChange={(e) =>
                      setPass({ ...pass, totalSlots: e.target.value })
                    }
                    className={`${inputClass} mt-1.5`}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-2 pt-1 sm:flex-row lg:flex-col xl:flex-row">
                <button
                  onClick={edit ? () => updatepass(edit) : addpass}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {edit ? <Check size={17} /> : <Plus size={17} />}
                  {edit ? "Save changes" : "Create pass"}
                </button>
                {edit && (
                  <button
                    onClick={() => {
                      setEdit(null);
                      setPass(emptyPass);
                    }}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <X size={16} /> Cancel
                  </button>
                )}
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Available passes</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review pricing, capacity, and availability.
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                {state?.passes?.length || 0} {state?.passes?.length === 1 ? "pass" : "passes"}
              </span>
            </div>

            {state?.passes?.length > 0 ? (
              <div className="space-y-3">
                {state.passes.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                            {item.name}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              item.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm leading-6 text-slate-500">
                          {item.description || "No description provided."}
                        </p>
                      </div>
                      <p className="shrink-0 text-xl font-bold text-slate-900 sm:text-right">
                        <span className="mr-1 text-sm font-medium text-slate-400">INR</span>
                        {Number(item.price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={15} className="text-slate-400" />
                        {item.soldSlots ?? 0} sold
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Ticket size={15} className="text-slate-400" />
                        {item.totalSlots} total
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CircleDollarSign size={15} className="text-slate-400" />
                        {Math.max(Number(item.totalSlots) - Number(item.soldSlots || 0), 0)} remaining
                      </span>
                      <div className="ml-auto flex w-full gap-2 sm:w-auto">
                        <button
                          onClick={() => editpass(item)}
                          aria-label={`Edit ${item.name}`}
                          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:flex-none"
                        >
                          <Pencil size={15} /> Edit
                        </button>
                        <button
                          onClick={() => deletepass(item.id)}
                          aria-label={`Delete ${item.name}`}
                          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-rose-100 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 sm:flex-none"
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Ticket size={22} />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">No passes yet</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
                  Add your first pass using the form to start managing event access.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
