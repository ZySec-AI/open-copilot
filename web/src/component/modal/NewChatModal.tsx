import { menuOptions } from "../data/Mockdata";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/component/ui/command"

import { Avatar, AvatarFallback, AvatarImage } from "@/component/ui/avatar";

const NewChatModal = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
    return (
        <CommandDialog
            open={open}
            onOpenChange={() => handleClose()}
        >
            <CommandInput placeholder="Type to search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="AI Experts">
                    {menuOptions.map((item, index) =>
                        <CommandItem keywords={item.label.split(' ')} key={index} className="gap-4">
                            <Avatar>
                                <AvatarImage src={item.avatarSrc} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span>{item.label}</span>
                        </CommandItem>
                    )}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};

export default NewChatModal;
