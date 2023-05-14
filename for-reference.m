let
    Source = Csv.Document(File.Contents("C:\Users\t-ste\Documents\GitHub\2023-spring\adv-fe-tuth\tca-roll-for-it\github-projects-tracking-02.csv"),[Delimiter=",", Columns=3, Encoding=1252, QuoteStyle=QuoteStyle.None]),
    #"Changed Type" = Table.TransformColumnTypes(Source,{{"Column1", type text}, {"Column2", type text}, {"Column3", type text}}),
    #"Promoted Headers" = Table.PromoteHeaders(#"Changed Type", [PromoteAllScalars=true]),
    #"Changed Type1" = Table.TransformColumnTypes(#"Promoted Headers",{{"Title", type text}, {"Remaining History", type text}, {"Status", type text}}),
    #"Filtered Rows" = Table.SelectRows(#"Changed Type1", each ([Status] <> "Might Do")),
    #"Split Column by Delimiter" = Table.ExpandListColumn(Table.TransformColumns(#"Filtered Rows", {{"Remaining History", Splitter.SplitTextByDelimiter(",", QuoteStyle.Csv), let itemType = (type nullable text) meta [Serialized.Text = true] in type {itemType}}}), "Remaining History"),
    #"Changed Type2" = Table.TransformColumnTypes(#"Split Column by Delimiter",{{"Remaining History", type text}}),
    #"Trimmed Text" = Table.TransformColumns(#"Changed Type2",{{"Remaining History", Text.Trim, type text}}),
    #"Split Column by Delimiter1" = Table.SplitColumn(#"Trimmed Text", "Remaining History", Splitter.SplitTextByDelimiter("=", QuoteStyle.Csv), {"Remaining History.1", "Remaining History.2"}),
    #"Duplicated Column" = Table.DuplicateColumn(#"Split Column by Delimiter1", "Title", "Title - Copy"),
    #"Duplicated Column1" = Table.DuplicateColumn(#"Duplicated Column", "Remaining History.1", "Remaining History.1 - Copy"),
    #"Merged Columns" = Table.CombineColumns(#"Duplicated Column1",{"Title - Copy", "Remaining History.1 - Copy"},Combiner.CombineTextByDelimiter(" ", QuoteStyle.None),"Title and Date for Sorting"),
    #"Changed Type3" = Table.TransformColumnTypes(#"Merged Columns",{{"Remaining History.1", type date}, {"Remaining History.2", type text}}),
    #"Renamed Columns" = Table.RenameColumns(#"Changed Type3",{{"Remaining History.1", "Date"}}),
    #"Reordered Columns" = Table.ReorderColumns(#"Renamed Columns",{"Date", "Title", "Remaining History.2", "Status"}),
    #"Duplicated Column2" = Table.DuplicateColumn(#"Reordered Columns", "Title", "Title - Copy"),
    #"Renamed Columns1" = Table.RenameColumns(#"Duplicated Column2",{{"Title - Copy", "Title Combined"}}),
    #"Split Column by Delimiter2" = Table.SplitColumn(#"Renamed Columns1", "Title", Splitter.SplitTextByDelimiter("/", QuoteStyle.Csv), {"Title.1", "Title.2"}),
    #"Reordered Columns1" = Table.ReorderColumns(#"Split Column by Delimiter2",{"Date", "Title Combined", "Title.1", "Title.2", "Remaining History.2", "Status", "Title and Date for Sorting"}),
    #"Changed Type4" = Table.TransformColumnTypes(#"Reordered Columns1",{{"Title.1", type text}, {"Title.2", type text}}),
    #"Sorted Rows" = Table.Sort(#"Changed Type4",{{"Title and Date for Sorting", Order.Ascending}}),
    #"Added Index" = Table.AddIndexColumn(#"Sorted Rows", "Index", 0, 1, Int64.Type),
    #"Renamed Columns2" = Table.RenameColumns(#"Added Index",{{"Remaining History.2", "Remaining"}}),
    #"Added Custom" = Table.AddColumn(
        #"Renamed Columns2"
        , "Delta"
        , each 
            if 
                [Index] > 0
                and [Title Combined] = #"Renamed Columns2"[Title Combined]{[Index] - 1}
            then 
                if
                    [Remaining] <> "x"
                then
                    Number.From([Remaining]) - Number.From(#"Renamed Columns2"[Remaining]{[Index] - 1})
                else 
                    Number.From(#"Renamed Columns2"[Remaining]{[Index] - 1}) * -1
            else 
                Number.From([Remaining])
    ),
    #"Added Custom1" = Table.AddColumn(
        #"Added Custom"
        , "Release Target"
        , each 
            if 
                [Delta] > 0 
                and [Remaining] <> "x"
            then 
                [Delta] 
            else
                if 
                    [Remaining] = "x"
                then
                    [Delta] 
                else 
                    0
    ),
    #"Added Custom2" = Table.AddColumn(#"Added Custom1", "Work Completed", each [Release Target] - [Delta]),
    #"Changed Type5" = Table.TransformColumnTypes(#"Added Custom2",{{"Delta", type number}})
in
    #"Changed Type5"