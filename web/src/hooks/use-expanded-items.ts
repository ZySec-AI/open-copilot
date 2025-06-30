import { TreeDataItem } from '@/component/ui/tree';
import * as React from 'react';

function useExpandedItems(
    data: TreeDataItem[] | TreeDataItem,
    expandAll: boolean,
    initialSelectedItemId?: string) {
        console.log("initialSelectedItemId",initialSelectedItemId);
        
    return React.useMemo(() => {
        if (!initialSelectedItemId) {
            return [[], []] as [string[], string[]]
        }

        const ids: string[] = []
        const names: string[] = []

        function walkTreeItems(items: TreeDataItem[] | TreeDataItem, targetId: string) {
            if (items instanceof Array) {
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < items.length; i++) {
                    ids.push(items[i]!.id);
                    names.push(items[i]!.name);
                    if (walkTreeItems(items[i]!, targetId) && !expandAll) {
                        return true;
                    }
                    if (!expandAll) {
                        ids.pop();
                        names.pop();
                    };
                }
            } else if (!expandAll && items.id === targetId) {
                return true;
            } else if (items.children) {
                return walkTreeItems(items.children, targetId)
            }
        }

        walkTreeItems(data, initialSelectedItemId)
        return [ids, names];

    }, [data, initialSelectedItemId, expandAll])
}

export { useExpandedItems }
