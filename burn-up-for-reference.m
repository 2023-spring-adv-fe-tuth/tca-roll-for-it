let
    Source = #"github-projects-tracking-02",
    #"Removed Other Columns" = Table.SelectColumns(Source,{"Date", "Release Target", "Work Completed"}),
    #"Grouped Rows" = Table.Group(#"Removed Other Columns", {"Date"}, {{"Release Target", each List.Sum([Release Target]), type number}, {"Work Completed", each List.Sum([Work Completed]), type number}}),
    #"Added Index" = Table.AddIndexColumn(#"Grouped Rows", "Index", 1, 1, Int64.Type),
    #"Added Custom" = Table.AddColumn(
        #"Added Index"
        , "Release Target Running Total"
        , each List.Sum(
                List.FirstN( 
                    #"Added Index"[Release Target],
                    [Index]
                )
            ) 
    ),
    #"Added Custom 2" = Table.AddColumn(
        #"Added Custom"
        , "Work Completed Running Total"
        , each List.Sum(
                List.FirstN( 
                    #"Added Index"[Work Completed],
                    [Index]
                )
            ) 
    ),
    #"Removed Other Columns1" = Table.SelectColumns(#"Added Custom 2",{"Work Completed Running Total", "Release Target Running Total", "Date"}),
    #"Reordered Columns" = Table.ReorderColumns(#"Removed Other Columns1",{"Date", "Release Target Running Total", "Work Completed Running Total"})
in
    #"Reordered Columns"