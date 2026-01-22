# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - link [ref=e5] [cursor=pointer]:
        - /url: /portal/accounting
        - img [ref=e6]
      - heading "Add Transaction" [level=1] [ref=e8]
    - generic [ref=e9]:
      - generic [ref=e10]:
        - button "Expense" [ref=e11]
        - button "Income" [ref=e12]
      - generic [ref=e13]:
        - generic [ref=e14]: Amount ($)
        - spinbutton [active] [ref=e15]
      - generic [ref=e16]:
        - generic [ref=e17]: Description
        - textbox "e.g. Lunch, Taxi, Salary" [ref=e18]
      - generic [ref=e19]:
        - generic [ref=e20]: Category
        - combobox "Category" [ref=e21]:
          - option "Food" [selected]
          - option "Transport"
          - option "Housing"
          - option "Salary"
          - option "Entertainment"
          - option "Utilities"
          - option "Shopping"
          - option "Health"
          - option "Other"
      - button "Save Transaction" [ref=e22] [cursor=pointer]:
        - img [ref=e23]
        - generic [ref=e27]: Save Transaction
  - alert [ref=e28]
```