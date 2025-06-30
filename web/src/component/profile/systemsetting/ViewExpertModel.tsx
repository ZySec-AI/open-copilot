import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/component/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/component/ui/avatar";
import Rating from "@mui/material/Rating";
import { BsGlobe } from "react-icons/bs";
import { Textarea } from "@/component/ui/textarea";
import { Link2, Clipboard } from "lucide-react";
import { Button } from "@/component/ui/button";
import { Switch } from "@/component/ui/switch";

const ViewExpertModal = ({ item, open, setOpen }: any) => {
    const [rating, setRating] = useState(item.rating);
    const [enable, setEnable] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="customPopupClass">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex gap-2">
                            <Avatar>
                                <AvatarImage src={item.logo_url} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="font-semibold text-2xl capitalize">{item.name}</div>
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        <div className="font-semibold capitalize text-2xl py-4">About {item.name}</div>
                        <div className="flex flex-col gap-4">
                            <Textarea className="py-4" value="This expert will tell you everything you ask about IP Addresses." />
                            <Textarea className="py-4" value={item.description} />
                        </div>
                        <div className="flex flex-row w-full gap-2">
                            <div className="flex flex-col py-2">
                                <div className="font-semibold capitalize mb-2">App ID</div>
                                <div className="flex flex-row border rounded-lg p-2 items-center">
                                    <div>API Key (2022-47-20 13:17:23)</div>
                                    <Clipboard />
                                </div>
                            </div>
                            <div className="flex flex-col py-2">
                                <div className="font-semibold capitalize mb-2">Secret Key</div>
                                <div className="flex flex-row border rounded-lg p-2 items-center">
                                    <div>API Key (2022-47-20 13:17:23)</div>
                                    <Clipboard />
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-between py-4">
                            <div className="border rounded-lg flex items-center gap-1 px-4 py-2">
                                <Link2 />
                                Desscription
                            </div>
                            <div className="border rounded-lg flex items-center gap-1 px-4 py-2">
                                <BsGlobe />
                                Needs internet access
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-between">
                            <div className="pt-3">
                                <Rating
                                    name="half-rating"
                                    precision={0.5}
                                    value={rating}
                                    onChange={(_event, newValue) => {
                                        setRating(newValue!);
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <label htmlFor="enabled">Enabled</label>
                                <Switch
                                    onCheckedChange={(_) => setEnable((x) => !x)}
                                    className="data-[state=checked]:bg-blue-700"
                                    checked={enable}
                                    id="enabled"
                                />
                            </div>
                        </div>
                        <div className="text-xl py-4 font-semibold">Write a review</div>
                        <div className="flex flex-col gap-4">
                            <Textarea className="py-4" />
                            <Button
                                className="bg-blue-700 rounded-lg border hover:border-blue-600 text-white hover:bg-white duration-300 ease-in-out hover:text-blue-600 px-1 w-full py-4"
                                onClick={(_) => setOpen(false)}>
                                Submit
                            </Button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ViewExpertModal;
