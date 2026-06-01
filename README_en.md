# BangumiList

BangumiList is a small application for visualizing tables, with several additional features built on top of a standard table system.

[中文](https://github.com/OathInMoonlight/BangumiList/blob/main/README.md) [日本語](https://github.com/OathInMoonlight/BangumiList/blob/main/README_ja.md)

- Add **images** to each row and display them in **Grid View**
- Support **nested two-level tables**, where each row maps to an internal sub-table
- Support searching, sorting, and **grouped sorting**

# Download

This application requires system-level WebView support (usually no additional setup is required).

The application package already includes language packs.

[Click here to download.](https://github.com/OathInMoonlight/BangumiList/releases)

# Usage Guide

## Language and Settings

![image](https://github.com/user-attachments/assets/b0b7b289-04c2-462e-9859-e914eab5fdf9)

### Language

A language selection menu is available at the bottom-left corner①. Click it to switch languages.

Currently supported languages: `[中文, 日本語, English]`

### Settings

Click the gear icon② in the bottom-left corner to open the settings page.

1. **Global Zoom**③: Adjust the overall scaling of the interface. It is recommended to first adjust the application's **DPI compatibility settings** in the system.
> Known issue: Some floating windows may not scale according to the global zoom value.

2. **Dark Mode**④: Adjust the background appearance of the interface. By default, it follows the system setting.

3. **Primary Color**⑤: Adjust the colors of buttons and other key UI elements. Several colors based on Material Design are provided.

4. **Save Settings File**⑥: When enabled, language and settings will be automatically saved to `bangumilist_setting.json` in the application root directory. The format is:

```json
{
    "language":"zh"|"ja"|"en",
    "globalZoom":1,
    "theme":"system"|"dark"|"light",
    "primaryColor":"#2196F3"
}
```

## Database Operations

### Open a Database

![image](https://github.com/user-attachments/assets/9e81711d-76b7-4e82-874c-99764d55ee4b)

There are three ways to open an existing `*.bldb` database:

- Click the dashed area in the center, then select a database file using the system file picker
- Locate the database file in the system file explorer and drag it into the dashed area
- Double-click a `*.bldb` file directly in the system file explorer

### Create or Edit a Database

![image](https://github.com/user-attachments/assets/7339de30-4c46-49a2-bd45-8c00fb7ea230)

When you click **Create Database**① or **Edit Database**②, the interface switches to the database editing page.

#### Database Settings

- **Grid View**③: Enable or disable Grid View. When enabled, a cover column will be forcibly inserted into the second column of both the main table and sub-table (if any).  
  This column uses paragraph format and stores an image URL.  
  If a sub-table exists, the inserted column in the main table will instead use a numeric format to indicate which sub-table image should be displayed.

- **Two-Level Table**④: Enable or disable nested sub-tables. When enabled, a sub-table will be added, and each main table entry will correspond to a sub-table with the same column structure but different content.

#### Main Table Settings / Sub-table Settings

- Click the plus icon button⑤ at the bottom to add a column to the table.
- The left-side button⑥ allows reordering columns or deleting created columns. To ensure data safety, once a column has been saved, its order cannot be modified and it cannot be deleted.

- **Grid View Cover Label**⑦: Used only in Grid View. Displays the `boolean` value of a column at the bottom-right corner of the image. Default is `Null`. A column index can be entered.

- **Grid View Title**⑧: Used only in Grid View. Displays titles below images. Accepts an array of column indices and attempts to display them in order.  
  If **Column Display Language** or **Column Visibility** is `false`, the next column will be automatically used.

Each column includes the following options:

- **Column Type**⑨: Select the data type of the column. Cannot be empty. Available types: `[Boolean, Tag, Number, Text, Paragraph]`  
  Among them, `Paragraph` supports line breaks.

- **Column Name**⑩: Display name of the column for all languages. If a language is unnecessary, it is recommended to fill it with another language instead of leaving it empty.

- **Column Sort Mapping**⑪: Specifies which column should be used as the sorting basis.  
  For example, if this column stores names and another column stores pronunciation/spelling, sorting can use that column instead.  
  By default, it uses its own column index.

- **Column Group Type**⑫: Specifies how this column is grouped during grouped sorting.  
  Default: `No Grouping`.

  - `Group by Alphabet`: Treats this column as **Text** or **Paragraph** and groups items by their first letter. Symbols and special characters are grouped under `#`.
  - JSON array format `(boolean | number | string)[]`: Groups values according to the provided array. Values not belonging to any group will be placed under `#`.

- **Column Display Language**⑬: Restricts the column to display only under a specific language. Default: `No Display Language`.

- **Column Value Preset**⑭: Defines display styles for `Boolean` and `Tag` columns. Default: `No Value Preset`.

  To configure a display mode, the following JSON format must be used:

```json
{
    ["key":string]:{
        "title?":{
            "zh": string,
            "ja": string,
            "en": string
        },
        "color?": string,
        "icon?": string
    }
}
```

`icon` must be an **SVG string**.
For `Boolean` columns，If `icon` exists, `icon` and `color` will be used and text will not be displayed. Otherwise, `title` and `color` will be used.
For `Tag` columns, `title` and `color` will be automatically applied.
- **Column Visibility**⑮: Specifies whether the column is visible by default.

### Save or Save As a Database

![image](https://github.com/user-attachments/assets/853c787c-97b5-4b53-9505-15702d64ca8c)

When the dot① in the title bar lights up, **Save Database**② and **Save Database As**③ become available.

If the current database is newly created, **Save Database** will automatically behave as **Save Database As**.

### Close Database

When switching to another database, you can click **Close Database**④ to return to Open Mode.

## Table Operations

### Toolbar

![image](https://github.com/user-attachments/assets/ef7efee1-07b5-418f-b2dc-f3d92f6adcb9)

#### Create Item

Click the plus button① to automatically enter a blank item in [Edit Mode](#edit-mode).

#### Import

Click② to import a `*.csv` file, which must follow the format below:

- The first row is treated as the table header and will be skipped automatically.
- From the second row to the last row, each row will be imported as one main table item.
- Sub-tables support two formats:

    - Same as the actual `*.bldb` format, where the 3rd column of the main table stores sub-table content as **JSON** text:

    ```
    Main Table Column 1,Main Table Column 2 (Sub-table JSON),Main Table Column 3
    1,"[{"0":1,"1":"Sub-table Row 1"},{"0":2,"1":"Sub-table Row 2"}]","Main Table Row 1"
    ```

    - Skip the 3rd column and expand sub-table columns after the last column of the main table. Sub-table columns will repeat up to the maximum number of sub-table items:

    ```
    Main Table Column 1,Main Table Column 2,Sub-table Column 1,Sub-table Column 2,Sub-table Column 1,Sub-table Column 2
    1,"Main Table Row 1",1,"Sub-table Row 1",2,"Sub-table Row 2"
    ```

Please confirm the following before importing:

1. The imported file format is UTF-8 (`.csv`)
2. Empty rows and columns have been removed, and non-empty rows contain indices
3. Column order and data formats match the current database

#### Export

Click③ to enter Export Mode.

![image](https://github.com/user-attachments/assets/afc8939d-a44b-434c-8191-bf25843a63a7)

1. **Export Language**④: Specifies the language used for table headers in the exported `*.csv` file. Display purpose only.
2. **Expand Sub-table**⑤: Specifies whether sub-table columns should be expanded. If enabled, sub-table columns will be appended after main table columns. See [Import](#import).

### View Bar

The button group in the top-right corner switches view modes.

![image](https://github.com/user-attachments/assets/0bb4e62d-9566-4cba-9a79-6983422fb1ae)

- **Grid View**①: Available only for databases with Grid View enabled. Displays each row as an image.  
  The image is determined by [Grid View Cover Label](#main-table-settings--sub-table-settings), and the title below the image is determined by [Grid View Title](#main-table-settings--sub-table-settings).

    - **Interaction Logic**:  
      Without sub-tables, clicking an image enters [View Mode](#view-mode) to view its content.  
      With sub-tables enabled, clicking an image in the main table enters its corresponding sub-table, while clicking an image in a sub-table enters **View Mode** normally. To modify the corresponding main table content, click the eye icon② in the top-right corner to enter its **View Mode**.

    - **Grid Size**:  
      The grid button group③ in the top-right corner changes image size only. To change the UI scale, adjust [Global Zoom](#settings).

    - **Sorting**:  
      The dropdown④ to the left of Grid Size selects sorting order. Each column supports ascending and descending order.

    - **Grouped Sorting**:  
      The dropdown⑤ to the left of Sorting controls grouped sorting. Default: `No Grouping`.  
      When **Column Group Type** is configured in [Column Settings](#main-table-settings--sub-table-settings), grouped sorting options for ascending/descending order will be available.  
      Items belonging to the same group are placed into collapsible panels, which are expanded by default.

- **Table View**①: Displays data in table form and provides a horizontal scrollbar for complete content display.

    - **Interaction Logic**:  
      Without sub-tables, clicking a row enters [View Mode](#view-mode).  
      With sub-tables enabled, clicking a row in the main table enters the corresponding sub-table, while clicking a row in a sub-table enters **View Mode** normally. To modify the corresponding main table content, click the eye icon② in the top-right corner to enter its **View Mode**.

    - **Sorting**:  
      Click a column header to switch sorting mode. Default sorting is ascending by the `Index` column.  
      First click → ascending sort  
      Second click → descending sort  
      Third click → reset to default

    - **Grouped Sorting**:  
      The dropdown⑤ to the left of view mode controls grouped sorting. Default: `No Grouping`.  
      When **Column Group Type** is configured in [Column Settings](#main-table-settings--sub-table-settings), grouped sorting options become available.  
      Grouped mode inserts an additional grouping column on the left side, merging rows belonging to the same group.

![image](https://github.com/user-attachments/assets/24323b91-5c88-4937-a641-eb8b0c4f1e81)

- **Statistics View**①: Displays statistical information for a selected column in chart form. Select a column using the dropdown②.

    - **Numeric Statistics**:  
      Available only for number columns. Displays `[Sum, Maximum, Minimum, Average]` values of the selected column.

    - **Bar Chart**:  
      Displays the frequency of occurrence for all values in the selected column.  
      X-axis: value  
      Y-axis: count

    - **Doughnut Chart**:  
      Displays the proportion of occurrence for all values in the selected column.

### Search Bar

Enter a value in the search bar① to search. The search mode is **Exact Match** — if any value in a row matches exactly, that row will be included in the search results.

A debounce delay of 150ms is applied while typing.

The area② on the right side of the search bar displays the number of matched rows.

### Item Content

![image](https://github.com/user-attachments/assets/436e452a-b1d1-4ec7-83ef-71f5e97fda04)

#### View Mode

Click an image in [Grid View](#view-bar) or click a row in [Table View](#view-bar) to enter View Mode.

If the row contains a corresponding image, it will be displayed in the image area① on the left side as well as in the background.

All columns and their corresponding values for the row are displayed vertically on the right side.

#### Edit Mode

Click the pencil icon② in the top-right corner while in [View Mode](#view-mode) to enter Edit Mode, where values for each column can be edited.

- `Boolean` type: Displayed as a switch that can be toggled by clicking.
- `Tag` type: Displayed as a dropdown selector. Values defined in **Column Value Preset** under [Column Definition](#main-table-settings--sub-table-settings) will appear as selectable options, while custom input is also allowed.
- `Number` type: Displayed as a numeric input field.
- `Text` type: Displayed as a text input field.
- `Paragraph` type: Also displayed as a text input field, but supports line breaks.  
  Line breaks should be entered directly via keyboard instead of escape sequences such as `\n`.

#### Delete Item

Click the trash icon③ in the top-right corner while in [View Mode](#view-mode) to delete the current row.

If the current row contains a sub-table, **the sub-table will also be deleted together**.
