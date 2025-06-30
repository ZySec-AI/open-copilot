import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/component/ui/breadcrumb";
import { Folder, useGetFoldersQuery } from "@/redux/folder/folderSlice";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function DocPath({
  expandedItemsIds,
  names,
  setTableData,
}: {
  expandedItemsIds: string[];
  names: string[];
  setTableData: any;
}) {
  const navigate = useNavigate();
  const { data: folderData } = useGetFoldersQuery();
  const searchChildren = (parent: Folder[], id: string) => {
    for (let item of parent) {
      if (item.id === id) {
        return item;
      }
      if (item?.children.length > 0) {
        const result: any = searchChildren(item.children, id);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };
  useEffect(() => {
    if (folderData) {
      if (expandedItemsIds.length === 0) {
        setTableData({ children: folderData });
      } else {
        let found = false;
        expandedItemsIds.forEach((expandedItemId) => {
          const item = searchChildren(folderData, expandedItemId);
          if (item) {
            setTableData(item);
            found = true;
          }
        });
        if (!found) {
          setTableData({ children: folderData });
        }
      }
    }
  }, [expandedItemsIds, folderData, setTableData]);


  const handleNavigate = (id: string) => {
    if (folderData && id) {
      const item = searchChildren(folderData, id);
      navigate(`/files/${id}`);
      setTableData(item);
    }
  };
  const handleHome = () => {
    navigate(`/files`);
    setTableData({children:folderData});
  };
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <span onClick={() => handleHome()}>Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {expandedItemsIds
          .slice(0, expandedItemsIds.length - 1)
          .map((id, index) => {
            return (
              <React.Fragment key={id}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <span onClick={() => handleNavigate(id)}>
                      {names[index]}
                    </span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        {names.length != 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{names[names.length - 1]}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export { DocPath };
