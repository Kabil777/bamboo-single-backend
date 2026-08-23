import {  BetweenHorizontalStart, Table } from "lucide-react"
import * as React from "react"

export const TableIcon = React.memo(
    ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
        return (
            <Table className={className} {...props} />
        )
    }
)


export const TableInsertIcon = React.memo(
    ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
        return (
            <BetweenHorizontalStart className={className} {...props} />
        )
    }
)

TableIcon.displayName = "TableIcon"
TableInsertIcon.displayName = "TableInsertIcon"