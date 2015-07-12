/* TODO

public class TEdit : WebSite.Com.Note.Page
  {
    protected WebSite.Com.Note.Com.Attach AttachUC;
    protected System.Web.UI.WebControls.ValidationSummary VdSummary;
    protected System.Web.UI.WebControls.RequiredFieldValidator TitleTBVd;
    protected System.Web.UI.WebControls.TextBox TitleTB;
    protected System.Web.UI.WebControls.RequiredFieldValidator TextTBVd;
    protected System.Web.UI.WebControls.TextBox TextTB;
    protected System.Web.UI.WebControls.CheckBoxList AttachDelCBList;
    protected System.Web.UI.WebControls.TextBox MusicTB;
    protected System.Web.UI.WebControls.RadioButtonList FolderListRBL;
    protected System.Web.UI.WebControls.CheckBox LockCB;
    protected System.Web.UI.WebControls.Button Submit;
    protected System.Web.UI.HtmlControls.HtmlGenericControl MsgTimeOutPanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl TitlePanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl AttachDelPanel;

    private NoteContext nc;
    protected System.Web.UI.WebControls.CheckBox HiddenCB;
    protected System.Web.UI.HtmlControls.HtmlGenericControl FolderSelPanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl LockCBPanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl HiddenCBPanel;
    private bool folderChanged;

    private void Page_Load(object sender, System.EventArgs e) {
      AssertAuthenticated();
      SetNoteContext();

      nc = NoteContext;

      SqlConnection conn;
      SqlCommand cmd;
      SqlDataReader reader;
      
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        nc.CheckPermForEdit(conn);
        NoteContext.SetRefPhotoScript(conn);
 
        if (!IsPostBack) {
          cmd = new SqlCommand("BBSSelectArticle", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@ArticleID", SqlDbType.Int).Value = nc.ArticleID;
          reader = cmd.ExecuteReader();
          
          reader.Read();
          TextTB.Text = reader["Text"].ToString();
          MusicTB.Text = reader["Music"].ToString();
          
          reader.NextResult();
          reader.Read();
          nc.CheckPermForHidden(reader["Hidden"].ToString()[0] == 'Y', (int)reader["UserID"]);
          if (nc.IsFirstArticle) {
            TitlePanel.Visible = true;
            TitleTB.Text = reader["Title"].ToString();
            LockCB.Checked = reader["Lock"].ToString()[0] == 'Y';
            HiddenCB.Checked = reader["Hidden"].ToString()[0] == 'Y';
          }
          reader.Close();
            
          TitleTB.Enabled = nc.IsContentEditable;
          TextTB.Enabled = nc.IsContentEditable;
          MusicTB.Enabled = nc.IsEditable;
          MsgTimeOutPanel.Visible = nc.IsEditTimedOut;

          if (nc.IsEditable) {
            AttachUC.Mode = nc.IsFirstArticle ? nc.AttachModeForNewThread() : nc.AttachModeForReply();
            DataView view = new BDSManager(nc.ArticleUserID, null, "BBS", nc.ArticleID).GetListDataView();
            if (view != null && view.Count > 0) {
              AttachDelPanel.Visible = true;
              AttachDelCBList.DataSource = view;
              AttachDelCBList.DataBind();
            }
          }

          FolderSelPanel.Visible = false;
          LockCBPanel.Visible = false;
          HiddenCBPanel.Visible = false;

          if (nc.IsFirstArticle) {
            if (nc.IsFolderAdmin) {
              cmd = new SqlCommand("BBSFolderSelectList", conn);
              cmd.CommandType = CommandType.StoredProcedure;
              cmd.Parameters.Add("@OwnerType", SqlDbType.Char,1).Value = nc.Folder.OwnerType;
              cmd.Parameters.Add("@OwnerID", SqlDbType.Int).Value = nc.Folder.OwnerID;
              cmd.Parameters.Add("@IncDisGuestNew", SqlDbType.Char,1).Value = "Y";
              cmd.Parameters.Add("@IncPhoto", SqlDbType.Char,1).Value = "Y";
              cmd.Parameters.Add("@IncHidden", SqlDbType.Char,1).Value = "Y";
              reader = cmd.ExecuteReader();
              FolderListRBL.DataValueField = "FolderID";
              FolderListRBL.DataTextField = "Title";
              FolderListRBL.DataSource = reader;
              FolderListRBL.DataBind();
              reader.Close();
              FolderListRBL.Items.FindByValue(nc.Folder.ID.ToString()).Selected = true;
              FolderSelPanel.Visible = true;
              LockCBPanel.Visible = true;
            }
            if (nc.IsEditable && nc.Folder.OwnerType == Folder.OwnerTypeBox) {
              HiddenCBPanel.Visible = true;
            }
          }

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
      this.FolderListRBL.SelectedIndexChanged += new System.EventHandler(this.FolderListRBL_SelectedIndexChanged);
      this.Submit.Click += new System.EventHandler(this.Submit_Click);
      this.Load += new System.EventHandler(this.Page_Load);

    }
    #endregion

    private void Submit_Click(object sender, System.EventArgs e) {
      if (IsValid) {
        SqlConnection conn;
        SqlCommand cmd;
        SqlDataReader reader;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();

          if (nc.IsFirstArticle) {
            cmd = new SqlCommand("BBSUpdateThread", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@ThreadID", SqlDbType.Int).Value = nc.ThreadID;
            if (nc.IsContentEditable) {
              cmd.Parameters.Add("@Title", SqlDbType.NVarChar, 128).Value = TitleTB.Text.Trim();
            }
            if (nc.IsFolderAdmin) {
              cmd.Parameters.Add("@Lock", SqlDbType.Char,1).Value = LockCB.Checked ? 'Y' : 'N';
              cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = Convert.ToInt32(FolderListRBL.SelectedItem.Value);
              cmd.Parameters.Add("@OwnerID", SqlDbType.Int).Value = nc.Folder.OwnerID; 
              cmd.Parameters.Add("@OwnerType", SqlDbType.Char,1).Value = nc.Folder.OwnerType;
            }
            if (nc.IsEditable && nc.Folder.OwnerType == Folder.OwnerTypeBox) {
              cmd.Parameters.Add("@Hidden", SqlDbType.Char,1).Value = HiddenCB.Checked ? 'Y' : 'N';
            }
            cmd.ExecuteNonQuery();
          }

          if (nc.IsEditable) {
            cmd = new SqlCommand("BBSUpdate", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@ArticleID", SqlDbType.Int).Value = nc.ArticleID;
            cmd.Parameters.Add("@Music", SqlDbType.VarChar, 1024).Value = MusicTB.Text.Trim();
            if (nc.IsContentEditable) {
              cmd.Parameters.Add("@Text", SqlDbType.NText).Value = TextTB.Text.Trim();
            }
            cmd.ExecuteNonQuery();

            BDSManager dsm = new BDSManager(UserManager.GetUser(nc.ArticleUserID), conn, "BBS",nc.ArticleID);
            dsm.DeleteFiles(AttachDelCBList);
            dsm.SaveFiles(!nc.Folder.AttachMultiple);
          }
        }
        if (folderChanged) {
          nc.ReturnToView();
        } else {
          ReturnToHostPage();
        }
      }
    }

    private void FolderListRBL_SelectedIndexChanged(object sender, System.EventArgs e) {
      folderChanged = true;
    }
  }

  
procedure BBSUpdate
  @ArticleID  int
  ,@Text    ntext = null
  ,@Music   varchar(1024)
  as

  if (@Text is null)
    update BBSArticles 
    set 
      Music = @Music
    where ArticleID = @ArticleID
  else
    update BBSArticles 
    set 
      [Text] = @Text,
      Music = @Music
    where ArticleID = @ArticleID
go

procedure BBSUpdateThread
  @ThreadID int
  ,@Title nvarchar(128) = null

  ,@FolderID  int = null
  ,@OwnerType char(1) = null
  ,@OwnerID int = null
  ,@Lock char(1) = null
  
  ,@Hidden char(1) = null
  as
  
  if (@Title is not null)
    update BBSThreads 
    set Title = @Title 
    where ThreadID = @ThreadID

  if (@Hidden is not null)
    update BBSThreads 
    set Hidden = @Hidden 
    where ThreadID = @ThreadID

  if @FolderID is not null
    update  BBSThreads 
    set 
      Lock = @Lock
      ,FolderID = @FolderID
    where ThreadID = @ThreadID and exists (select * from BBSFolders where OwnerType = @OwnerType and OwnerID = @OwnerID and FolderID = @FolderID)
go
*/