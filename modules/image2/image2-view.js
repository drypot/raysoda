
/* TODO

public class PView : WebSite.Com.BoxPhoto.Page
  {
    protected Bah.Web.Controls.SqlDataRepeater CommentRep;
    protected Bah.Web.Controls.SqlDataRepeater FolderRep;
    protected System.Web.UI.WebControls.ValidationSummary VdSummary;
    protected System.Web.UI.WebControls.RequiredFieldValidator CommentTBVd;
    protected System.Web.UI.WebControls.TextBox CommentTB;
    protected System.Web.UI.WebControls.Button Submit;
    protected System.Web.UI.HtmlControls.HtmlGenericControl ViewPanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl MsgNotExists;
    protected System.Web.UI.WebControls.PlaceHolder NoteHolder;

    public string rvTitle;
    public int rvHit;
    public string rvCDate;
    public string rvComment;
    public string rvMusic;
    
    public string rvPrevUrl = "";
    public string rvNextUrl = "";
    public string rvFolderListUrl = "";
    public string rvPhotoListUrl = "";
    public string rvEditUrl = "";
    public string rvRefPhotoScript;
    public string rvFolderListScript;
    public string rvCommentScript;
    protected System.Web.UI.WebControls.TextBox GuestNameTB;
    protected System.Web.UI.WebControls.RequiredFieldValidator GuestNameVd;
    protected System.Web.UI.WebControls.RegularExpressionValidator GuestNameREVd;
    protected System.Web.UI.WebControls.TextBox GuestPasswordTB;
    protected System.Web.UI.WebControls.RequiredFieldValidator GuestPasswordReqVd;
    protected System.Web.UI.HtmlControls.HtmlGenericControl GuestNamePanel;

    private BoxPhotoContext ctx;

    private void Page_Load(object sender, System.EventArgs e) {
      Response.Cache.SetCacheability(HttpCacheability.NoCache);
      SetBoxPhotoContext();
      ctx = BoxPhotoContext;
    }

    private void Page_PreRender(object sender, System.EventArgs e) {
      SqlConnection conn;
      SqlCommand cmd;
      SqlDataReader reader;
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();

        cmd = new SqlCommand("BoxPhotoIncHit",conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Value = ctx.PhotoID;
        cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = UserID;
        cmd.ExecuteNonQuery();
        
        cmd = new SqlCommand("BoxPhotoSelectExV", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Value = ctx.PhotoID;
        cmd.Parameters.Add("@SortKey", SqlDbType.Char, 1).Value = ctx.SortKey;
        cmd.Parameters.Add("@SortDir", SqlDbType.Char, 1).Value = ctx.SortDir;
        cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = ctx.FolderID;
        reader = cmd.ExecuteReader();

        if (reader.Read()) {
          int photoUserID = (int)reader["UserID"];
          ScriptBuilder script;
          
          script = new ScriptBuilder(1024);
          script.ScriptBegin();
          script.Func("lpRPB");
          script.FuncBegin("lpRP");
          script.ParamEscaped(new BDSManager(photoUserID, null, "P", ctx.PhotoID).GetVirtualFilePath());
          script.Param((byte)reader["Border"]);
          script.FuncEnd();
          script.Func("lpRPE");
          script.ScriptEnd();
          rvRefPhotoScript = script.ToString();

          rvTitle = Bah.Web.Html.Util.GetJScriptString(reader["Title"].ToString());
          rvHit = (int)reader["Hit"];
          rvCDate = ((DateTime)reader["CDate"]).ToString("yyyy-MM-dd HH:mm");
          rvComment = Bah.Web.Html.Util.GetJScriptString((string)reader["Comment"]);
          rvMusic = Bah.Web.Html.Util.GetJScriptString((string)reader["Music"]);

          switch (ctx.Function) {
            case BoxPhotoContext.FuncPhoto:
            case BoxPhotoContext.FuncPhotoFav:
            case BoxPhotoContext.FuncPhotoLast:
              rvFolderListUrl = "";
              rvPhotoListUrl = ctx.UrlMaker.GetUrl("PList.aspx");
              break;
            default :
              rvFolderListUrl = ctx.UrlMaker.Clone().AddParam("l",null).GetUrl("FList.aspx");
              rvPhotoListUrl = ctx.UrlMaker.GetUrl("FView.aspx");
              break;
          }

          if (UserID == photoUserID || IsAdmin / * IsBoxAdmin  -- FuncFav 모드에서 사진을 보는 경우 때문에 사용 불능* /) {
            rvEditUrl = ctx.UrlMaker.Clone().AddParam("p", ctx.PhotoID).GetUrl("PEdit.aspx");
          }

          reader.NextResult();
          script = new ScriptBuilder(2048);
          while(reader.Read()) {
            script.FuncBegin("bpPIF");
            script.Param((int)reader["FolderID"]);
            script.Param((string)reader["Func"]);
            script.ParamEscaped((string)reader["Title"]);
            script.Param(photoUserID);
            script.FuncEnd();

            string note = (string)reader["Note"];
            if (note.Length > 0) {
              script.FuncBegin("bpPINA");
              script.ParamEscaped(note);
              script.FuncEnd();
            }
          }
          rvFolderListScript = script.ToString();

          reader.NextResult();
          if (reader.HasRows) {
            int cuid;
            script = new ScriptBuilder(4096);
            script.ScriptBegin();
            script.FuncBegin("bpFCB").Param(ctx.UrlMaker.AddParam("p",ctx.PhotoID).GetUrl("PCEdit.aspx")).FuncEnd();
            while(reader.Read()) {
              cuid = (int)reader["UserID"];
              script.FuncBegin("bpFC");
              script.Param((int)reader["CommentID"]);
              script.Param(cuid);
              if (cuid > 0) {
                script.Param(WebSite.UserManager.GetUser(cuid).Name);
              } else {
                script.Param((string)reader["GuestName"]);
              }
              script.Param(((DateTime)reader["CDate"]).ToString("yyyy-MM-dd HH:mm"));
              script.ParamEscaped((string)reader["Comment"]);
              script.FuncEnd();
            }
            script.Func("bpFCE");
            script.ScriptEnd();
            rvCommentScript = script.ToString();
          }

          if (reader.NextResult()) {
            if (reader.Read()) {
              int id;
              Bah.Web.Http.UrlMaker urlMaker = ctx.UrlMaker.Clone();

              id = (int)reader["PrevID"];
              if (id > 0) {
                rvPrevUrl = urlMaker.AddParam("p", id).GetUrl("PView.aspx");
              }
              id = (int)reader["NextID"];
              if (id > 0) {
                rvNextUrl = urlMaker.AddParam("p", id).GetUrl("PView.aspx");
              }
            }
          }

          GuestNamePanel.Visible = !User.IsAuthenticated;
        } else {
          ViewPanel.Visible=false;
          MsgNotExists.Visible=true;
        }
        reader.Close();
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
      this.PreRender += new System.EventHandler(this.Page_PreRender);

    }
    #endregion

    private void Submit_Click(object sender, System.EventArgs e) {
      //AssertAuthenticated();
      if (IsValid) {
        SqlConnection conn;
        SqlCommand cmd;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          cmd = new SqlCommand("BoxPCInsert",conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Value = ctx.PhotoID;
          if (GuestNamePanel.Visible) {
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = 0;
            cmd.Parameters.Add("@GuestName", SqlDbType.NVarChar, 16).Value = GuestNameTB.Text.Trim();
            cmd.Parameters.Add("@GuestPassword", SqlDbType.NVarChar, 16).Value = GuestPasswordTB.Text.Trim();
          } else {
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = UserID;
            cmd.Parameters.Add("@GuestName", SqlDbType.NVarChar, 16).Value = String.Empty;
            cmd.Parameters.Add("@GuestPassword", SqlDbType.NVarChar, 16).Value = String.Empty;
          }
          cmd.Parameters.Add("@Comment", SqlDbType.NVarChar, 4000).Value = CommentTB.Text.Trim();
          cmd.ExecuteNonQuery();
        }
        //ctx.UrlMaker.AddParam("p", ctx.PhotoID).Redirect("PView.aspx");
        Response.Redirect("/Com/Etc/HB1.htm");
      }
    }
  
  }


procedure BoxPhotoSelect
    @PhotoID int
    as

    select UserID
    from BoxPhotos
    where PhotoID = @PhotoID
  go

procedure BoxPhotoSelectExE
    @PhotoID int
    ,@FolderID int
    as

    select Title, Comment, Music, Border
    from BoxPhotos
    where PhotoID = @PhotoID

    select FolderID 
    from BoxFoldersPhotos
    where PhotoID = @PhotoID

    select SortValue
    from BoxFoldersPhotos
    where FolderID = @FolderID and PhotoID = @PhotoID
  go

procedure BoxPhotoSelectExV
    @PhotoID int
    ,@SortKey char(1) = null
    ,@SortDir char(1) = null
    ,@FolderID int = null
    as

    select UserID, Title, Hit, Comment, Music, CDate, Border
    from BoxPhotos
    where PhotoID = @PhotoID

    select FP.FolderID, F.Title, F.Func, F.Note
    from BoxFoldersPhotos FP join BoxFolders F on FP.FolderID = F.FolderID
    where FP.PhotoID = @PhotoID
    order by F.Func desc, F.Title 

    -- BoxPhotoSelectComments
    select CommentID, UserID, GuestName, Comment, CDate
    from BoxPhotoComments
    where PhotoID = @PhotoID
    order by CDate
  go

  
*/
