import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import PasswordChangeForm from "../../components/Profile/PasswordChangeForm ";
import { IoArrowBackCircle, IoCamera } from "react-icons/io5";
import { Button, GetProp, Input, message, Upload, UploadProps } from "antd";
import usePrivateAxios from "../../hooks/usePrivateAxios";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
};

export default function Profile() {
    const [isFollowing, setIsFollowing] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const base_url = import.meta.env.VITE_BE_URL;
    const { auth, setAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(
        auth?.avatar ? `${base_url}/${auth.avatar}` : ""
    );
    const axios = usePrivateAxios();

    const [name, setName] = useState(auth?.name || "");
    const [avatar, setAvatar] = useState<FileType | null>(null);
    const handleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    useEffect(() => {
        setName(auth?.name || "");
        setImageUrl(auth?.avatar ? `${base_url}/${auth.avatar}` : "");
    }, [auth?.name, auth?.avatar]);


    const handleShowMore = () => {
        setShowMore(!showMore);
    };
    const handleChange: UploadProps["onChange"] = (info) => {
        const file = info.file.originFileObj as FileType;

        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }

        if (info.file.status === "done" || file) {
            setAvatar(file); // Set the uploaded file
            getBase64(file, (url) => {
                setLoading(false);
                setImageUrl(url); // Set the preview image URL
            });
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            if (avatar) {
                formData.append("avatar", avatar);
            }

            await axios
                .put("/auth/profile", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    setAuth({ ...auth!, name: res.data.data.name, avatar: res.data.data.avatar });
                    message.success("Profile updated successfully!");
                });
        } catch (error) {
            message.error("Something went wrong!");
        }
    };

    return (
        <div className="flex items-center justify-center  h-screen">
            <div className="absolute top-4 left-4">
                <IoArrowBackCircle
                    size={32}
                    className="cursor-pointer transition-all transform hover:opacity-70"
                    onClick={() => window.history.back()}
                />
            </div>


            <div className="w-2/3 bg-white rounded-2xl shadow-lg overflow-hidden h">
                {/* Banner Image */}
                <div
                    className="relative h-36 bg-cover bg-center"
                    style={{ backgroundImage: "url('/bg-avatar.jpg')" }}
                ></div>

                {/* Profile Image and Info */}
                <div className="p-6 pt-1 flex">
                    <div className="flex flex-1 items-start flex-col">
                        {/* Profile Picture */}
                        <div className="-mt-16 rounded-full border-4 border-white  z-10 relative">
                            <Upload
                                name="avatar"
                                listType="picture-circle"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                            >
                                <div className="relative w-24 h-24">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt="avatar"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "100%",
                                                objectFit: "cover",
                                            }}
                                            className="cursor-pointer"
                                        />
                                    ) : (
                                        <img
                                            src={`${base_url + "/" + auth?.avatar}`}
                                            alt="avatar"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "100%",
                                            }}
                                        />
                                    )}

                                </div>
                            </Upload>
                            <div className="absolute z-10 -bottom-0 -right-3 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full p-2">
                                <IoCamera size={18} color="white" />
                            </div>
                        </div>


                        {/* Name and Role */}
                        <div className="ml-2 mb-4">
                            <div className="flex gap-2 items-baseline">
                                <h1 className="text-2xl font-bold">{auth?.name}</h1>
                                <p className="text-gray-600 text-sm ">
                                    {auth?.role === 0 ? "Admin" : "Staff"}
                                </p>
                            </div>

                            <p className="text-gray-500 text-sm flex items-center mt-1">
                                <img src="/gmail.png" className="w-4 mr-2" /> {auth?.email}
                            </p>
                        </div>
                        <div className="w-full max-w-md flex flex-col justify-between h-1/2">
                            <div>
                                <div className="mb-2">
                                    <label className="text-gray-500 text-xs font-medium" htmlFor="email">
                                        EMAIL
                                    </label>
                                    <Input
                                        type="email"
                                        id="email"
                                        className="w-full mt-1"
                                        value={auth?.email}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-500 text-xs font-medium" htmlFor="name">
                                        NAME
                                    </label>
                                    <Input
                                        id="name"
                                        className="w-full mt-1"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="primary"
                                    className="mt-4 w-full"
                                    onClick={handleSubmit}
                                    loading={loading}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>

                        {/* <div className="h-[100px]">hello</div> */}
                    </div>

                    {/* Follower and Connection Counts */}
                    <PasswordChangeForm />

                </div>
            </div>
        </div>
    );
}
