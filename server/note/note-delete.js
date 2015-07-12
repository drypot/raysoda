/* TODO

public class TDelete : WebSite.Com.Note.Page
  {

    private NoteContext nc;
    protected System.Web.UI.WebControls.ValidationSummary VdSummary;
    protected System.Web.UI.WebControls.CheckBox DeleteCB;
    protected System.Web.UI.WebControls.Button Submit;
    protected System.Web.UI.HtmlControls.HtmlGenericControl MsgTimeOutPanel;

    private void Page_Load(object sender, System.EventArgs e) {
      AssertAuthenticated();
      SetNoteContext();

      nc = NoteContext;

      SqlConnection conn;
      SqlCommand cmd;
      SqlDataReader reader;
      
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        nc.CheckPermForDelete(conn);
        NoteContext.SetRefPhotoScript(conn);
 
        if (!IsPostBack) {
          MsgTimeOutPanel.Visible = nc.IsEditTimedOut;
          DeleteCB.Enabled = nc.IsDeletable;
          
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
      if (IsValid && nc.IsDeletable && DeleteCB.Checked) {
        SqlConnection conn;
        SqlConnection conn2;
        SqlCommand cmd;
        SqlDataReader reader;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          cmd = new SqlCommand("BBSDelete", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@ArticleID", SqlDbType.Int).Value = nc.ArticleID;
          reader = cmd.ExecuteReader();
          using (conn2 = new SqlConnection(WebSite.Global.DSN)) {
            conn2.Open();
            while (reader.Read()) {
              new BDSManager((int)reader["UserID"],conn2, "BBS",(int)reader["ArticleID"]).DeleteFiles();
            }
          }
          reader.Close();
        }
        if (nc.IsFirstArticle) {
          nc.ReturnToView();
        }
      }
      ReturnToHostPage();
    }
  }

  
procedure BBSDelete
  @ArticleID  int
  as

  if (exists (select * from BBSThreads where ThreadID = @ArticleID))
    begin
      begin tran
        select UserID, ArticleID 
        from BBSArticles 
        where ThreadID = @ArticleID
        
        delete from BBSArticles
        where ThreadID = @ArticleID

        delete from BBSThreads
        where ThreadID = @ArticleID

        delete from BBSThreadsPhotos
        where ThreadID = @ArticleID
        
        delete from BBSUsersThreads
        where ThreadID = @ArticleID
      commit tran
    end
  else
    begin
      begin tran
        declare @UserID int
        declare @ThreadID int
        
        select @UserID = UserID, @ThreadID = ThreadID from BBSArticles where ArticleID = @ArticleID
        
        --*
        if (
          (
            select count(*) 
            from BBSArticles 
            where UserID = @UserID and ThreadID = @ThreadID
          ) = 1
        )
          delete from BBSUsersThreads
          where UserID = @UserID and ThreadID = @ThreadID
        --*

        select UserID, ArticleID from BBSArticles 
        where ArticleID = @ArticleID
        
        delete from BBSArticles
        where ArticleID = @ArticleID
        
      commit tran
    end
go

*/