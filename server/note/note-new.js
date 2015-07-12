/* TODO

public class TNew : WebSite.Com.Note.Page
  {
    protected System.Web.UI.WebControls.ValidationSummary VdSummary;
    protected System.Web.UI.WebControls.RequiredFieldValidator TitleTBVd;
    protected System.Web.UI.WebControls.TextBox TitleTB;
    protected System.Web.UI.WebControls.RequiredFieldValidator TextTBVd;
    protected System.Web.UI.WebControls.TextBox TextTB;
    protected System.Web.UI.WebControls.TextBox MusicTB;
    protected System.Web.UI.WebControls.Button Submit;
    protected WebSite.Com.Note.Com.Attach AttachUC;
    protected System.Web.UI.WebControls.CheckBox HiddenCB;
    protected System.Web.UI.HtmlControls.HtmlGenericControl HiddenCBPanel;
    protected Bah.Web.Controls.DummyValidator LenLimitVD;

    private void Page_Load(object sender, System.EventArgs e) {
      AssertAuthenticated();
      SetNoteContext();

      SqlConnection conn;
      SqlCommand cmd;
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        NoteContext.CheckPermForNewThread(conn);
        NoteContext.SetRefPhotoScript(conn);
        AttachUC.Mode = NoteContext.AttachModeForNewThread();
        HiddenCBPanel.Visible = NoteContext.Folder.OwnerType == Folder.OwnerTypeBox;
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
      string textTrimed = TextTB.Text.Trim();
      LenLimitVD.IsValid = !NoteContext.Folder.Photo || textTrimed.Length > 500; 
      if (IsValid) {
        SqlConnection conn;
        SqlCommand cmd;
        NoteContext nc = NoteContext;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          cmd = new SqlCommand("BBSInsert", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@ArticleID", SqlDbType.Int).Direction = ParameterDirection.Output;
          cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = nc.FolderID;
          cmd.Parameters.Add("@ThreadID", SqlDbType.Int).Value = 0;
          cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = UserID;
          cmd.Parameters.Add("@Title", SqlDbType.NVarChar, 128).Value = TitleTB.Text.Trim();
          cmd.Parameters.Add("@Text", SqlDbType.NText).Value = textTrimed;
          cmd.Parameters.Add("@Music", SqlDbType.VarChar, 1024).Value = MusicTB.Text.Trim();
          cmd.Parameters.Add("@Hidden", SqlDbType.Char, 1).Value = HiddenCB.Checked ? "Y" : "N";
          cmd.Parameters.Add("@Result", SqlDbType.Int).Direction = ParameterDirection.Output;
          if (nc.Folder.Photo) {
            cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Value = nc.PhotoID;
          }
          cmd.ExecuteNonQuery();

          if ((int)cmd.Parameters["@Result"].Value > 0) {
            if (nc.Folder.Attach) {
              new BDSManager(User, conn, "BBS", (int)cmd.Parameters["@ArticleID"].Value).SaveFiles(false);
            }
          }

        }
        //NoteContext.UrlMaker.AddParam("pg", null);
        NoteContext.ReturnToView();
      }
    }

  }

  


Folder Select

public class FSel : WebSite.Com.Note.Page
  {
    protected System.Web.UI.WebControls.RadioButtonList FolderListRBL;
    protected System.Web.UI.WebControls.Button Submit;
    protected System.Web.UI.HtmlControls.HtmlGenericControl MsgNoValidFolder;
    protected System.Web.UI.HtmlControls.HtmlGenericControl FormPanel;

    private NoteContext nc;
    private string cmdParam;

    private void Page_Load(object sender, System.EventArgs e) {
      SetNoteContext();
      nc = NoteContext;

      cmdParam = Request.QueryString["cmd"];

      SqlConnection conn;
      SqlCommand cmd;
      SqlDataReader reader;
      
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        if (!IsPostBack) {
          cmd = new SqlCommand("BBSFolderSelectList", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          switch (nc.Function) {
            case NoteContext.FuncPublic :
              cmd.Parameters.Add("@OwnerType", SqlDbType.Char,1).Value = Folder.OwnerTypePublic;
              cmd.Parameters.Add("@OwnerID", SqlDbType.Int).Value = 0;
              break;
            case NoteContext.FuncBox :
              cmd.Parameters.Add("@OwnerType", SqlDbType.Char,1).Value = Folder.OwnerTypeBox;
              cmd.Parameters.Add("@OwnerID", SqlDbType.Int).Value = OwnerID;
              break;
            default :
              AssertFailed();
              break;
          }
          switch (cmdParam) {
            case "TN" :
              switch (nc.Function) {
                case NoteContext.FuncPublic :
                  cmd.Parameters.Add("@IncHidden", SqlDbType.Char,1).Value = IsBBSAdmin ? "Y" : "N";
                  cmd.Parameters.Add("@IncDisGuestNew", SqlDbType.Char,1).Value = IsBBSAdmin ? "Y" : "N";
                  break;
                case NoteContext.FuncBox :
                  cmd.Parameters.Add("@IncHidden", SqlDbType.Char,1).Value = IsOwner || IsBBSAdmin ? "Y" : "N";
                  cmd.Parameters.Add("@IncDisGuestNew", SqlDbType.Char,1).Value = IsOwner || IsBBSAdmin ? "Y" : "N";
                  break;
                default :
                  AssertFailed();
                  break;
              }
              cmd.Parameters.Add("@IncPhoto", SqlDbType.Char,1).Value = 'N';
              break;
            case "FE" :
              cmd.Parameters.Add("@IncHidden", SqlDbType.Char,1).Value = "Y";
              cmd.Parameters.Add("@IncDisGuestNew", SqlDbType.Char,1).Value = "Y";
              cmd.Parameters.Add("@IncPhoto", SqlDbType.Char,1).Value = 'Y';
              break;
            default :
              AssertFailed();
              break;
          }
          reader = cmd.ExecuteReader();
          if (reader.HasRows) {
            FolderListRBL.DataValueField = "FolderID";
            FolderListRBL.DataTextField = "Title";
            FolderListRBL.DataSource = reader;
            FolderListRBL.DataBind();
            FolderListRBL.Items[0].Selected = true;
          } else {
            FormPanel.Visible = false;
            MsgNoValidFolder.Visible = true;
          }
          reader.Close();
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
        int folderID = Convert.ToInt32(FolderListRBL.SelectedItem.Value);
        switch(cmdParam) {
          case "TN" :
            nc.UrlMaker.AddParam("l",folderID).Redirect("TNew.aspx");
            break;
          case "FE" :
            nc.UrlMaker.AddParam("l",folderID).Redirect("FEdit.aspx");
            break;
          default :
            AssertFailed();
            break;
        }
      }
    }

  }


procedure BBSInsert
  @ArticleID    int = null output
  ,@FolderID    int = null
  ,@ThreadID    int
  ,@UserID    int
  ,@PhotoID   int = 0
  ,@Hidden    char(1) = null
  ,@Title     nvarchar(128) = null
  ,@Music     varchar(1024)
  ,@Text      ntext
  ,@Result    int output
  as

  select @Result = 0
  exec SeqNextValue 'bbs', @ArticleID output
  
  if (@ThreadID = 0)
  begin
    begin tran
      if (@PhotoID = 0 or exists (select * from Photos where UserID != @UserID and PhotoID = @PhotoID))
      begin
        insert 
        BBSThreads(ThreadID, UserID, FolderID, Title, Hidden)
        values(@ArticleID, @UserID, @FolderID, @Title, @Hidden)

        insert 
        into BBSArticles(ArticleID, ThreadID, UserID, [Text], Music)
        values (@ArticleID, @ArticleID, @UserID, @Text, @Music)

        if (@PhotoID is not null)
          insert
          BBSThreadsPhotos(ThreadID, PhotoID)
          values (@ArticleID, @PhotoID)

        insert
        BBSUsersThreads(UserID, ThreadID)
        values(@UserID, @ArticleID)
        
        select @Result = 1
      end
    commit tran
  end
  else  
  begin
    begin tran
      if (exists (select * from BBSThreads where ThreadID = @ThreadID and Lock = 'N'))
      begin
        update BBSThreads
        set UDate = getdate()
        where ThreadID = @ThreadID
        
        insert 
        into BBSArticles(ArticleID, ThreadID, UserID, [Text], Music)
        values (@ArticleID, @ThreadID, @UserID, @Text, @Music)

        if (not exists (select * from BBSUsersThreads where UserID = @UserID and ThreadID = @ThreadID))
          insert
          BBSUsersThreads(UserID, ThreadID)
          values(@UserID, @ThreadID)

        select @Result = 1
      end
    commit tran
  end
go


*/