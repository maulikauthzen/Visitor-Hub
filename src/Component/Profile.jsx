import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    getprofile();
  }, []);

  function getprofile() {
    const token = localStorage.getItem("token");

    axios
      .get(`http://192.168.1.64:3000/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function editprofile() {
    setEdit(true);
  }

  function handleChange(e) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  }

  function updateprofile() {
    const token = localStorage.getItem("token");

    axios
      .patch(
        `http://192.168.1.64:3000/user/details`,
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          gender: profile.gender,
          city: profile.city,
          company: profile.company,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setProfile(res.data);
        setEdit(false);
      })
      .catch((error) => {
        console.log(error.message[0]);
        alert("all fielda are reqired")
      });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6ef]">
        <div className="text-lg font-medium text-[#173d32]">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6ef] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#47735b]">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#14251f] sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage your personal information.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#d8e2d5] bg-white shadow-lg">
          <div className="relative overflow-hidden bg-[#173d32] px-6 py-10 sm:px-10">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#47735b] opacity-40 blur-3xl"></div>

            <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#6f927a] opacity-30 blur-3xl"></div>

            <div className="relative flex flex-col items-center gap-5 sm:flex-row">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/30 bg-[#e9ddc9] text-4xl font-bold text-[#173d32] shadow-xl">
                {profile.firstName
                  ? profile.firstName.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  {profile.firstName} {profile.lastName}
                </h2>

                <p className="mt-1 text-sm text-white/70">{profile.email}</p>

                <div className="mt-4 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
                  {profile.gender || "Profile"}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#14251f]">
                Personal Information
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Your account details are shown below.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm font-medium text-gray-500">First Name</p>

                {edit ? (
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName || ""}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#14251f] outline-none focus:border-[#47735b] focus:ring-2 focus:ring-[#47735b]/20"
                  />
                ) : (
                  <p className="mt-2 text-lg font-semibold text-[#14251f]">
                    {profile.firstName || "Not available"}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm font-medium text-gray-500">Last Name</p>

                {edit ? (
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName || ""}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#14251f] outline-none focus:border-[#47735b] focus:ring-2 focus:ring-[#47735b]/20"
                  />
                ) : (
                  <p className="mt-2 text-lg font-semibold text-[#14251f]">
                    {profile.lastName || "Not available"}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm font-medium text-gray-500">
                  Email Address
                </p>

                {edit ? (
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={profile.email || ""}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#14251f] outline-none focus:border-[#47735b] focus:ring-2 focus:ring-[#47735b]/20"
                  />
                ) : (
                  <p className="mt-2 break-all text-lg font-semibold text-[#14251f]">
                    {profile.email || "Not available"}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm font-medium text-gray-500">
                  Phone Number
                </p>

                {edit ? (
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone || ""}
                    disabled
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#14251f] outline-none focus:border-[#47735b] focus:ring-2 focus:ring-[#47735b]/20"
                  />
                ) : (
                  <p className="mt-2 text-lg font-semibold text-[#14251f]">
                    {profile.phone || "Not available"}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm font-medium text-gray-500">Gender</p>

                {edit ? (
                  <select
                    name="gender"
                    value={profile.gender || ""}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#14251f] outline-none focus:border-[#47735b] focus:ring-2 focus:ring-[#47735b]/20"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="mt-2 text-lg font-semibold capitalize text-[#14251f]">
                    {profile.gender || "Not available"}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm font-medium text-gray-500">City</p>

                {edit ? (
                  <input
                    type="text"
                    name="city"
                    value={profile.city || ""}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#14251f] outline-none focus:border-[#47735b] focus:ring-2 focus:ring-[#47735b]/20"
                  />
                ) : (
                  <p className="mt-2 text-lg font-semibold text-[#14251f]">
                    {profile.city || "Not available"}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">Company</p>

                {edit ? (
                  <input
                    type="text"
                    name="company"
                    value={profile.company || ""}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#14251f] outline-none focus:border-[#47735b] focus:ring-2 focus:ring-[#47735b]/20"
                  />
                ) : (
                  <p className="mt-2 text-lg font-semibold text-[#14251f]">
                    {profile.company || "Not available"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
              {edit ? (
                <>
                  <button
                    onClick={() => {
                      getprofile();
                      setEdit(false);
                    }}
                    className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-600 transition hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={updateprofile}
                    className="rounded-xl bg-[#47735b] px-6 py-3 font-semibold text-white transition hover:bg-[#365d47]"
                  >
                    Update Profile
                  </button>
                </>
              ) : (
                <button
                  onClick={editprofile}
                  className="rounded-xl border border-[#47735b] px-6 py-3 font-semibold text-[#47735b] transition hover:bg-[#e9f0e7]"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
