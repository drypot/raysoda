
/* TODO

public class PNew : WebSite.Com.BoxPhoto.Page
  {
    protected System.Web.UI.WebControls.ValidationSummary VdSummary;
    protected System.Web.UI.WebControls.TextBox TitleTB;
    protected System.Web.UI.WebControls.TextBox CommentTB;
    protected System.Web.UI.WebControls.TextBox MusicTB;
    protected System.Web.UI.WebControls.Panel CategoryHolder;
    protected System.Web.UI.WebControls.RadioButtonList BorderList;
    protected System.Web.UI.HtmlControls.HtmlInputFile ImageAtt;
    protected System.Web.UI.WebControls.Button Submit;
    protected Bah.Web.Controls.DummyValidator ImageAttVd;
    protected Bah.Web.Controls.DummyValidator ImageSizeVd;
    protected Bah.Web.Controls.DummyValidator UnknownErrVd;

    private BoxPhotoContext ctx;

    private void Page_Load(object sender, System.EventArgs e) {
      AssertBoxOwner();
      SetBoxPhotoContext();
      ctx = BoxPhotoContext;

      SqlConnection conn;
      SqlCommand cmd;
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        ctx.MakeCategoryCBList(conn, CategoryHolder);   
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
      if (ImageAtt.PostedFile == null || ImageAtt.PostedFile.ContentLength == 0) {
        ImageAttVd.IsValid = false;
      } else if (ImageAtt.PostedFile.ContentLength > 1024 * 1024) {
        ImageSizeVd.IsValid = false;
      }
      User.AssertFreeSpace(ImageAtt.PostedFile.ContentLength + 32*1024);
      if (Page.IsValid) {
        SqlConnection conn;
        SqlCommand cmd;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          cmd = new SqlCommand("BoxPhotoInsert", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Direction = ParameterDirection.Output;
          cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = UserID;
          cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = ctx.FolderID;
          cmd.Parameters.Add("@Border", SqlDbType.TinyInt).Value = byte.Parse(BorderList.SelectedValue);
          cmd.Parameters.Add("@Title", SqlDbType.NVarChar, 128).Value = TitleTB.Text.Trim();
          cmd.Parameters.Add("@Comment", SqlDbType.NText).Value = CommentTB.Text.Trim();
          cmd.Parameters.Add("@Music", SqlDbType.VarChar, 1024).Value = MusicTB.Text.Trim();
          cmd.Parameters.Add("@RowCount", SqlDbType.Int).Direction = ParameterDirection.Output;
          cmd.ExecuteNonQuery();
          if ((int)cmd.Parameters["@RowCount"].Value > 0) {
            ctx.PhotoID = (int)cmd.Parameters["@PhotoID"].Value;
            ctx.InsertCategory(conn, CategoryHolder);
            ctx.SaveAttachFiles(UserID, conn);
          } else {
            UnknownErrVd.IsValid= false;
          }
        } 
      }
      if (Page.IsValid) {
        ctx.UrlMaker.Redirect("FView.aspx");
      }
    }
  }
  
procedure BoxPhotoInsert
    @PhotoID int output
    ,@UserID int
    ,@FolderID int
    ,@Border tinyint
    ,@Title nvarchar(128)
    ,@Comment ntext
    ,@Music varchar(1024)
    ,@RowCount int output
    as

    if (exists (select * from BoxFolders where UserID = @UserID and FolderID = @FolderID and Func = 'S'))
    begin
      exec SeqNextValue 'boxphoto', @PhotoID output
      
      insert 
      BoxPhotos(PhotoID, UserID, Border, Title, Comment, Music)
      values(@PhotoID, @UserID, @Border, @Title, @Comment, @Music)

      insert
      BoxFoldersPhotos(FolderID, PhotoID, SortValue)
      select @FolderID, @PhotoID, isnull(max(SortValue),0) + 10 from BoxFoldersPhotos where FolderID = @FolderID

      select @RowCount = 1
    end
    else
      select @RowCount = 0
  go

*/
