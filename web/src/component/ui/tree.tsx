import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/component/ui/dropdown-menu";
import React, { useEffect } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ScrollArea } from "@/component/ui/scroll-area"
import { cn } from "@/lib/utils";
import { ChevronRight, EllipsisVertical, type LucideIcon } from "lucide-react";
import useResizeObserver from "use-resize-observer";

interface TreeDataItem {
    id: string;
    name: string;
    icon?: LucideIcon,
    children?: TreeDataItem[];
}

type TreeProps =
    React.HTMLAttributes<HTMLDivElement> &
    {
        data: TreeDataItem[] | TreeDataItem,
        initialSelectedItemId?: string,
        onSelectChange?: (item: TreeDataItem | undefined) => void,
        expandAll?: boolean,
        expandedItemIds: string[],
        folderIcon?: LucideIcon,
        itemIcon?: LucideIcon,
        menuContent?: React.FC<{ type: "folder" | "file", id?: string }>;
    }

const Tree = React.forwardRef<
    HTMLDivElement,
    TreeProps
>(({
    data, initialSelectedItemId, onSelectChange, expandAll,
    folderIcon,
    itemIcon,
    expandedItemIds,
    menuContent,
    className, ...props
}, ref) => {
    const [selectedItemId, setSelectedItemId] = React.useState<string | undefined>(initialSelectedItemId);

    useEffect(()=>{
        if(selectedItemId !== initialSelectedItemId){
            setSelectedItemId(initialSelectedItemId)
        }
    },[initialSelectedItemId])

    const handleSelectChange = React.useCallback((item: TreeDataItem | undefined) => {
        setSelectedItemId(item?.id);
        if (onSelectChange) {
            onSelectChange(item)
        }
    }, [onSelectChange]);

    const { ref: refRoot, width, height = 600 } = useResizeObserver();

    return (
        <div ref={refRoot} className={cn("overflow-hidden", className)}>
            <ScrollArea style={{ width, height }}>
                <div className="relative p-2">
                    <TreeItem
                        data={data}
                        ref={ref}
                        selectedItemId={selectedItemId}
                        handleSelectChange={handleSelectChange}
                        expandedItemIds={expandedItemIds}
                        FolderIcon={folderIcon}
                        ItemIcon={itemIcon}
                        menuContent={menuContent}
                        {...props}
                    />
                </div>
            </ScrollArea>
        </div>
    )
})

type TreeItemProps =
    TreeProps &
    {
        selectedItemId?: string,
        handleSelectChange: (item: TreeDataItem | undefined) => void,
        expandedItemIds: string[],
        FolderIcon?: LucideIcon,
        ItemIcon?: LucideIcon
    }

const TreeItem = React.forwardRef<
    HTMLDivElement,
    TreeItemProps
>(({ className, data, selectedItemId, handleSelectChange, expandedItemIds, FolderIcon, ItemIcon, menuContent: MenuContent, ...props }, ref) => {
    return (
        <div ref={ref} role="tree" className={className} {...props}><ul>
            {data instanceof Array ? (
                data.map((item) => (
                    <li key={item.id}>
                        {item.children && item.children.length != 0 ? (
                            <AccordionPrimitive.Root type="multiple" value={expandedItemIds} defaultValue={expandedItemIds}>
                                <AccordionPrimitive.Item value={item.id}>
                                    <AccordionTrigger
                                        className={cn(
                                            "px-2 hover:before:opacity-100 before:absolute before:left-0 before:w-full before:opacity-0 before:bg-muted/80 before:h-[1.75rem] before:-z-10",
                                            selectedItemId === item.id && "before:opacity-100 before:bg-accent text-accent-foreground before:border-l-2 before:border-l-accent-foreground/50 dark:before:border-0"
                                        )}
                                        onClick={() => handleSelectChange(item)}
                                    >
                                        {item.icon && (
                                            <item.icon
                                                className="h-4 w-4 shrink-0 text-accent-foreground/50 "
                                                aria-hidden="true"
                                            />
                                        )}
                                        {!item.icon && FolderIcon && (
                                            <FolderIcon
                                                className="h-4 w-4 shrink-0 text-accent-foreground/50"
                                                aria-hidden="true"
                                            />
                                        )}
                                        <span className="text-sm px-1.5 truncate">{item.name}</span>
                                        {MenuContent && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="ml-auto" asChild>
                                                    <EllipsisVertical
                                                        className="h-4 w-4 invisible text-accent-foreground/50 duration-100 group-hover:visible ml-auto"
                                                    />
                                                </DropdownMenuTrigger>
                                                <MenuContent id={item.id} type="folder" />
                                            </DropdownMenu>
                                        )}
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-6">
                                        <TreeItem
                                            data={item.children}
                                            selectedItemId={selectedItemId}
                                            handleSelectChange={handleSelectChange}
                                            expandedItemIds={expandedItemIds}
                                            FolderIcon={FolderIcon}
                                            ItemIcon={ItemIcon}
                                            menuContent={MenuContent}
                                        />
                                    </AccordionContent>
                                </AccordionPrimitive.Item>
                            </AccordionPrimitive.Root>
                        ) : (
                            <Leaf
                                item={item}
                                isSelected={selectedItemId === item.id}
                                onClick={() => handleSelectChange(item)}
                                Icon={ItemIcon}
                                menuContent={MenuContent}
                            />
                        )}
                    </li>
                ))
            ) : (
                <li>
                    <Leaf
                        item={data}
                        isSelected={selectedItemId === data.id}
                        onClick={() => handleSelectChange(data)}
                        Icon={ItemIcon}
                        menuContent={MenuContent}
                    />
                </li>
            )}
        </ul></div>
    );
})

const Leaf = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        item: TreeDataItem, isSelected?: boolean,
        Icon?: LucideIcon,
        menuContent?: React.FC<{ type: "folder" | "file", id?: string }>,
    }
>(({ className, item, isSelected, Icon, menuContent: MenuContent, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "flex flex-1 w-full gap-2 items-center py-2 px-2 cursor-pointer \
        hover:before:opacity-100 before:absolute before:left-0 before:right-1 before:w-full before:opacity-0 before:bg-muted/80 before:h-[1.75rem] before:-z-10 group",
                className,
                isSelected && "before:opacity-100 before:bg-accent text-accent-foreground before:border-l-2 before:border-l-accent-foreground/50 dark:before:border-0"
            )}
            {...props}
        >
            {Icon && <Icon className="h-4 w-4 shrink-0 mr-2 text-accent-foreground/50" aria-hidden="true" />}
            <span className="flex-grow text-sm truncate">{item.name}</span>
            {MenuContent && (
                <DropdownMenu>
                    <DropdownMenuTrigger className="justify-self-end" asChild>
                        <EllipsisVertical
                            className="h-4 w-4 invisible text-accent-foreground/50 duration-100 group-hover:visible ml-auto"
                        />
                    </DropdownMenuTrigger>
                    <MenuContent id={item.id} type="folder" />
                </DropdownMenu>
            )}
        </div>
    );
})

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex flex-1 w-full align-middle justify-self-start gap-2 py-2 transition-all last:[&[data-state=open]>svg]:rotate-90 group",
                className
            )}
            {...props}
        >
            {children}
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 text-accent-foreground/50" />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
            className
        )}
        {...props}
    >
        <div className="pb-1 pt-0">{children}</div>
    </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Tree, type TreeDataItem, AccordionContent, AccordionTrigger, AccordionPrimitive }
