/* TODO

public class TReply : WebSite.Com.Note.Page
  {
    protected System.Web.UI.WebControls.ValidationSummary VdSummary;
    protected System.Web.UI.WebControls.RequiredFieldValidator TextTBVd;
    protected System.Web.UI.WebControls.TextBox TextTB;
    protected System.Web.UI.WebControls.TextBox MusicTB;
    protected System.Web.UI.WebControls.Button Submit;
    protected WebSite.Com.Note.Com.Attach AttachUC;

    private void Page_Load(object sender, System.EventArgs e) {
      AssertAuthenticated();
      SetNoteContext();

      SqlConnection conn;
      SqlCommand cmd;
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        NoteContext.CheckPermForReply(conn);
        NoteContext.SetRefPhotoScript(conn);
        AttachUC.Mode = NoteContext.AttachModeForReply();

        if (!IsPostBack) {
          SaveHostPage();
        }
      }
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
    
    /// <summary>
    /// Required method for Designer support - do not modify
    /// the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {    
      this.Submit.Click += new System.EventHandler(this.Submit_Click);
      this.Load += new System.EventHandler(this.Page_Load);
    }
    #endregion

    private void Submit_Click(object sender, System.EventArgs e) {
      if (IsValid) {
        SqlConnection conn;
        SqlCommand cmd;
        SqlDataReader reader;
        NoteContext nc = NoteContext;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open(); 

          cmd = new SqlCommand("BBSInsert", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@ArticleID", SqlDbType.Int).Direction = ParameterDirection.Output;
          cmd.Parameters.Add("@ThreadID", SqlDbType.Int).Value = nc.ThreadID;
          cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = UserID;
          cmd.Parameters.Add("@Text", SqlDbType.NText).Value = TextTB.Text.Trim();
          cmd.Parameters.Add("@Music", SqlDbType.VarChar, 1024).Value = MusicTB.Text.Trim();
          cmd.Parameters.Add("@Result", SqlDbType.Int).Direction = ParameterDirection.Output;
          cmd.ExecuteNonQuery();

          if ((int)cmd.Parameters["@Result"].Value > 0) {
            if (nc.Folder.Attach) {
              new BDSManager(User, conn, "BBS", (int)cmd.Parameters["@ArticleID"].Value).SaveFiles(false);
            }
          }
        } 
        //Response.Redirect("/Com/Etc/HB2.htm");
        //nc.UrlMaker.AddParam("t", nc.ThreadID);
        //nc.ReturnToView();
        ReturnToHostPage();
      }
    }

  }

*/