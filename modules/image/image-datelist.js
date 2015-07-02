/* TODO

public abstract class DefDayList : WebSite.UserControl
  {
    public string PageUrl;
    public string ScriptRV;
    public DateTime FirstDate;
    public DateTime LastDate;
    public DateTime CurrentDate;
    public int ScreenSize = 9;

    protected override void OnPreRender(EventArgs e) {
      if (Visible) {
        DateTime day;
        DateTime dayLimit;
        DateTime tmp1, tmp2;
        StringBuilder buf = new StringBuilder(512);

        tmp1 = CurrentDate.AddDays(ScreenSize / 2);
        tmp2 = FirstDate.AddDays(ScreenSize - 1);
        day = tmp1 > tmp2 ? tmp1 : tmp2;
        day = day > LastDate ? LastDate : day;
      
        dayLimit = day.AddDays(-ScreenSize+1);
        dayLimit = dayLimit < FirstDate ? FirstDate : dayLimit;
    
        buf.Append("<script>\n");
        buf.Append("dtlB('").Append(PageUrl).Append("')\n");

        if (day < LastDate) {
          buf.Append("dtlF('").Append(LastDate.ToString("yyMMdd")).Append("','").Append(LastDate.ToString("yy.MM.dd")).Append("')\n");
        } 
        while (day >= dayLimit) {
          buf.Append("dtlI('").Append(day.ToString("yyMMdd")).Append("','").Append(day.ToString("yy.MM.dd")).Append("',").Append(day == CurrentDate ? "true" : "false").Append(")\n");
          day = day.AddDays(-1);
        }
        if (day >= FirstDate) {
          buf.Append("dtlL('").Append(FirstDate.ToString("yyMMdd")).Append("','").Append(FirstDate.ToString("yy.MM.dd")).Append("')\n");
        } 

        buf.Append("dtlE()\n</script>\n");
        ScriptRV = buf.ToString();
      }
      base.OnPreRender(e);
    }

    #region Web Form Designer generated code
    override protected void OnInit(EventArgs e)
    {
      //
      // CODEGEN: This call is required by the ASP.NET Web Form Designer.
      //
      InitializeComponent();
      base.OnInit(e);
    }
    
    ///   Required method for Designer support - do not modify
    ///   the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {
    }
    #endregion
  }
  
*/