import { ReactNode } from "react";

export interface Tab {
    id: string;
    label: string;
    content: ReactNode;
}

export interface TabViewProps {
    tabs: Tab[];
}