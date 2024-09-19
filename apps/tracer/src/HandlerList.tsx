import "./HandlerList.css";
import { Handler, ScopeId, HandlerId } from "./model.js";
import { Tree, TreeNodeInfo } from "@blueprintjs/core";

export interface HandlerListProps {
    handlers: Handler[];
    selectedScope: ScopeId;
    onScopeSelect: ScopeEventHandler;
    selectedHandler: HandlerId;
    onHandlerSelect: HandlerEventHandler;
}

export type ScopeEventHandler = (id: ScopeId) => void;
export type HandlerEventHandler = (id: HandlerId) => void;

export default function HandlerList({ handlers, selectedScope, onScopeSelect, selectedHandler, onHandlerSelect }: HandlerListProps) {
    const scopes = handlers.reduce((result, { scope }) => result.add(scope), new Set<string>());
    const handlerNodes: TreeNodeInfo[] = Array.from(scopes).map(scope => {
        const isExpanded = scope === selectedScope;
        return {
            id: scope,
            label: labelFromScope(scope),
            isExpanded,
            icon: isExpanded ? "folder-open" : "folder-close",
            childNodes: handlers
                .filter(h => h.scope === scope)
                .map(({ id, display_name }) => {
                    return {
                        id,
                        label: display_name,
                        isSelected: id === selectedHandler,
                        icon: "code-block",
                    };
                }),
        };
    });

    function handleNodeClick(node: TreeNodeInfo) {
        if (typeof node.id === "string") {
            onScopeSelect((selectedScope !== node.id) ? node.id : "");
        } else {
            onHandlerSelect(node.id as HandlerId);
        }
    }

    function handleNodeExpand(node: TreeNodeInfo) {
        onScopeSelect(node.id as ScopeId);
    }

    function handleNodeCollapse() {
        onScopeSelect("");
    }

    return (
        <Tree
            className="handler-list"
            contents={handlerNodes}
            onNodeClick={handleNodeClick}
            onNodeExpand={handleNodeExpand}
            onNodeCollapse={handleNodeCollapse}
        />
    );
}

function labelFromScope(scope: string) {
    let dirsepIndex = scope.lastIndexOf("/");
    if (dirsepIndex === -1) {
        dirsepIndex = scope.lastIndexOf("\\");
    }
    if (dirsepIndex === -1) {
        return scope;
    }
    return scope.substring(dirsepIndex + 1);
}