public abstract class DefPageList : WebSite.UserControl
  {
    private Bah.Web.Http.UrlMaker urlMaker;
    protected System.Web.UI.WebControls.Panel MsgPlzLogin;
    protected System.Web.UI.WebControls.Panel PageListPanel;

    public string PageUrl;

    public int PageCount = 0;
    public int PageNumber = 0;
    public int ScreenSize = 10;

    public bool ShowForced = false;
    public bool CheckAuthenticated = true;

    public string ScriptRV = String.Empty;

    protected override void OnPreRender(EventArgs e) {
      ScriptBuilder script = new ScriptBuilder(512);

      script.ScriptBegin();

      script.FuncBegin("pglBegin").Param(PageUrl).FuncEnd();

      if (PageCount > 1 || ShowForced) {
        /*
        //if (!CheckAuthenticated || Page.User.IsAuthenticated) {
        */
          int screenIdx = System.Math.Max(System.Math.Min(PageNumber - ScreenSize / 2, PageCount - ScreenSize), 0);
          int screenIdxLimit = System.Math.Min(screenIdx + ScreenSize, PageCount);

          if (screenIdx > 0) {
            script.FuncBegin("pglF");
            script.Param(0);
            script.FuncEnd();
          } 
          while (screenIdx < screenIdxLimit) {
            script.FuncBegin("pglI");
            script.Param(screenIdx);
            if (screenIdx == PageNumber) {
              script.Param(true);
            }
            script.FuncEnd();
            screenIdx++;
          }
          if (screenIdx < PageCount) {
            script.FuncBegin("pglL");
            script.Param(PageCount - 1);
            script.FuncEnd();
          } 

        /*
        } else {
          MsgPlzLogin.Visible = true;
        }
        */

      }
      script.Func("pglEnd");
      script.ScriptEnd();

      ScriptRV = script.ToString();
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