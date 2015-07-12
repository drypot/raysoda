
/* TODO

public class PEdit : WebSite.Com.BoxPhoto.Page
  {
    protected System.Web.UI.WebControls.ValidationSummary VdSummary;
    protected System.Web.UI.WebControls.TextBox TitleTB;
    protected System.Web.UI.WebControls.TextBox CommentTB;
    protected System.Web.UI.WebControls.TextBox MusicTB;
    protected System.Web.UI.WebControls.Panel CategoryHolder;
    protected System.Web.UI.WebControls.RadioButtonList BorderList;
    protected System.Web.UI.HtmlControls.HtmlInputFile ImageAtt;
    protected System.Web.UI.WebControls.Button Submit;
    protected Bah.Web.Controls.DummyValidator ImageSizeVd;
    protected Bah.Web.Controls.DummyValidator UnknownErrVd;
    protected System.Web.UI.WebControls.RequiredFieldValidator SortValueTBReqVd;
    protected System.Web.UI.WebControls.RegularExpressionValidator SortValueTBRegVd;
    protected System.Web.UI.WebControls.TextBox SortValueTB;
    protected System.Web.UI.WebControls.TextBox FolderTitleTB;
    protected Bah.Web.Controls.DummyValidator FolderDupVd;
    protected Bah.Web.Controls.DummyValidator FolderNotExistVd;

    private BoxPhotoContext ctx;

    private void Page_Load(object sender, System.EventArgs e) {
      AssertAuthenticated();
      SetBoxPhotoContext();
      ctx = BoxPhotoContext;

      SqlConnection conn;
      SqlCommand cmd;
      SqlDataReader reader;
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();

        ctx.MakeCategoryCBList(conn, CategoryHolder);   

        if (!IsPostBack) {
          cmd = new SqlCommand("BoxPhotoSelectExE", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Value = ctx.PhotoID;
          cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = ctx.FolderID;
          reader = cmd.ExecuteReader();
        
          reader.Read();
          TitleTB.Text = reader["Title"].ToString();
          CommentTB.Text = reader["Comment"].ToString();
          MusicTB.Text = reader["Music"].ToString();
          BorderList.Items.FindByValue(reader["Border"].ToString()).Selected = true;

          reader.NextResult();
          while (reader.Read()) {
            CheckBox cb = CategoryHolder.FindControl(reader["FolderID"].ToString()) as CheckBox;
            if (cb != null) {
              cb.Checked = true;
            }
          }

          reader.NextResult();
          if (reader.Read()) {
            SortValueTB.Text = reader["SortValue"].ToString();
            SortValueTB.Enabled = true;
          } else {
            SortValueTB.Text = "0";
            SortValueTB.Enabled = false;
          }
          reader.Close();

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
      if (ImageAtt.PostedFile.ContentLength > 1024 * 1024) {
        ImageSizeVd.IsValid = false;
      }
      User.AssertFreeSpace(ImageAtt.PostedFile.ContentLength + 32*1024);
      if (Page.IsValid) {
        SqlConnection conn;
        SqlCommand cmd;
        SqlDataReader reader;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();

          cmd = new SqlCommand("BoxPhotoUpdate", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@UserID", SqlDbType.Int).Direction = ParameterDirection.InputOutput;
          if (!IsAdmin) {
            cmd.Parameters["@UserID"].Value = UserID;
          }
          cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Value= ctx.PhotoID;
          cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = ctx.FolderID;
          cmd.Parameters.Add("@Border", SqlDbType.TinyInt).Value = byte.Parse(BorderList.SelectedValue);
          cmd.Parameters.Add("@Title", SqlDbType.NVarChar, 128).Value = TitleTB.Text.Trim();
          cmd.Parameters.Add("@Comment", SqlDbType.NText).Value = CommentTB.Text.Trim();
          cmd.Parameters.Add("@Music", SqlDbType.VarChar, 1024).Value = MusicTB.Text.Trim();
          cmd.Parameters.Add("@SortValue", SqlDbType.Int).Value = Int32.Parse(SortValueTB.Text);
          cmd.Parameters.Add("@RowCount", SqlDbType.Int).Direction = ParameterDirection.Output;
          cmd.ExecuteNonQuery();

          if ((int)cmd.Parameters["@RowCount"].Value > 0) {
            int photoUserID = (int)cmd.Parameters["@UserID"].Value;
            ctx.InsertCategory(conn, CategoryHolder);
            if (ImageAtt.PostedFile.ContentLength > 0) {
              ctx.SaveAttachFiles(photoUserID, conn);
            }
            string folderTitle = FolderTitleTB.Text.Trim();
            if (folderTitle.Length > 0) {
              cmd = new SqlCommand("BoxPhotoUpdateFolder", conn);
              cmd.CommandType = CommandType.StoredProcedure;
              cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Value= ctx.PhotoID;
              cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = photoUserID;
              cmd.Parameters.Add("@FolderTitle", SqlDbType.NVarChar, 128).Value = folderTitle;
              cmd.Parameters.Add("@RowCount", SqlDbType.Int).Direction = ParameterDirection.Output;
              cmd.ExecuteNonQuery();
              switch ((int)cmd.Parameters["@RowCount"].Value) {
                case 0 :
                  FolderNotExistVd.IsValid = false;
                  break;
                case 1 :
                  break;
                default :
                  FolderDupVd.IsValid = false;
                  break;
              }
            }
          }

          if (Page.IsValid) {
            ReturnToHostPage();
          }
        } 
      }
    }

    
procedure BoxPhotoUpdate
    @PhotoID int
    ,@FolderID int
    ,@UserID int = null output
    ,@Border tinyint
    ,@Title nvarchar(128)
    ,@Comment ntext
    ,@Music varchar(1024)
    ,@SortValue int
    ,@RowCount int output
    as
    
    if (@UserID is null)
      select @UserID = UserID from BoxPhotos where PhotoID = @PhotoID

    update BoxPhotos
    set Title = @Title, Comment = @Comment, Music = @Music, Border=@Border
    where PhotoID = @PhotoID and UserID = @UserID

    select @RowCount = @@rowcount

    if (@RowCount > 0) 
      update BoxFoldersPhotos
      set SortValue = @SortValue
      where FolderID = @FolderID and PhotoID = @PhotoID
  go

procedure BoxPhotoUpdateFolder
    @PhotoID int
    ,@UserID int
    ,@FolderTitle nvarchar(128)
    ,@RowCount int output
    as

    begin tran
    
      select @RowCount = count(*) from BoxFolders where UserID = @UserID and Title = @FolderTitle and Func='S'
      
      if (@RowCount = 1)
      begin
          declare @FolderID int

          select @FolderID = FolderID from BoxFolders where UserID = @UserID and Title = @FolderTitle and Func='S'

          delete BoxFoldersPhotos 
          from BoxFoldersPhotos FP join BoxFolders F on FP.FolderID = F.FolderID
          where FP.PhotoID = @PhotoID and F.Func = 'S'
          
          insert
          BoxFoldersPhotos(FolderID, PhotoID, SortValue)
          select @FolderID, @PhotoID, isnull(max(SortValue),0) + 10 from BoxFoldersPhotos where FolderID = @FolderID
      end

    commit tran
  go

*/
