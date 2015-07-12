/* TODO

protected System.Web.UI.WebControls.ValidationSummary VdSummary;
    protected System.Web.UI.WebControls.TextBox CommentTB;
    //protected System.Web.UI.WebControls.Button Submit;
    protected System.Web.UI.HtmlControls.HtmlGenericControl ViewPanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl MsgNotExists;
    protected Bah.Web.Controls.SqlDataRepeater ThumbRep;
    protected Bah.Web.Controls.SqlDataRepeater PicRep;
    //protected Bah.Web.Controls.SqlDataRepeater CommentRep;
    //protected System.Web.UI.WebControls.RequiredFieldValidator CommentTBVd;
    protected System.Web.UI.WebControls.RadioButtonList ViewModeRBL;
    protected System.Web.UI.WebControls.PlaceHolder EditLinkHolder;
    protected System.Web.UI.WebControls.PlaceHolder NewLinkHolder;
    //protected System.Web.UI.WebControls.PlaceHolder NoteHolder;
    //protected System.Web.UI.WebControls.PlaceHolder CommentFormHolder;

    public string rvPhotoList;

    public string rvPViewUrl;
    public string rvFEditLink;
    public string rvFDeleteLink;
    public string rvFFrontLink;
    public string rvFListLink;
    public string rvPNewLink;

    public string rvTitle;
    public string rvComment;
    public string rvNote;
    public int rvHit;
    public string rvCDate;
    public string rvMusic;

    private BoxPhotoContext ctx;

    private void Page_Load(object sender, System.EventArgs e) {
      Response.Cache.SetCacheability(HttpCacheability.NoCache);
      SetBoxPhotoContext();
      ctx = BoxPhotoContext;

      SqlConnection conn;
      SqlCommand cmd;
      SqlDataReader reader;
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();

        if (!IsOwner) {
          cmd = new SqlCommand("BoxFolderIncHit",conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = ctx.FolderID;
          cmd.ExecuteNonQuery();
        }
        
        cmd = new SqlCommand("BoxFolderSelectEx", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = ctx.FolderID;
        cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = OwnerID;
        reader = cmd.ExecuteReader();

        if (reader.Read()) {
          rvPViewUrl = ctx.UrlMaker.GetUrl("PView.aspx");
          rvFEditLink = ctx.UrlMaker.GetUrl("FEdit.aspx");
          rvFDeleteLink = ctx.UrlMaker.GetUrl("FDelete.aspx");
          rvFFrontLink = ctx.UrlMaker.GetUrl("FFront.aspx");
          rvFListLink = ctx.UrlMaker.Clone().AddParam("l",null).GetUrl("FList.aspx");
          rvPNewLink =   ctx.UrlMaker.GetUrl("PNew.aspx");

          rvTitle = Bah.Web.Html.Util.GetJScriptString((string)reader["Title"]);
          rvComment = Bah.Web.Html.Util.GetJScriptString((string)reader["Comment"]);
          rvNote = Bah.Web.Html.Util.GetJScriptString((string)reader["Note"]);

          rvHit = (int)reader["Hit"];
          rvCDate = ((DateTime)reader["CDate"]).ToString("yyyy-MM-dd HH:mm");
          rvMusic = Bah.Web.Html.Util.GetJScriptString((string)reader["Music"]);

          //DataBind();

          EditLinkHolder.Visible = IsBoxAdmin;
          NewLinkHolder.Visible = IsBoxAdmin && ((string)reader["Func"])[0] == BoxPhotoContext.FuncPrimary;
          //NoteHolder.Visible = rvNote.Length > 0;
          //CommentFormHolder.Visible = User.IsAuthenticated;

          reader.NextResult();
          ScriptBuilder script = new ScriptBuilder(4096);
          script.ScriptBegin();
          if (ctx.ViewMode == 'N') {
            script.FuncBegin("bpFPB").Param(rvPViewUrl).FuncEnd();
            while (reader.Read()) {
              script.FuncBegin("bpFP");
              script.Param((int)reader["PhotoID"]);
              script.ParamEscaped(new BDSManager(OwnerID, null, "P", (int)reader["PhotoID"]).GetFileName());
              script.ParamEscaped((string)reader["Title"]);
              script.Param((int)reader["RepCnt"]);
              script.Param((int)reader["Hit"]);
              script.Param(((DateTime)reader["CDate"]).ToString("yyyy-MM-dd HH:mm"));
              script.Param((int)reader["SortValue"]);
              script.Param((bool)(reader["Music"].ToString()[0] == 'Y'));
              script.FuncEnd();
            }
            script.Func("bpFPE");
          } else {
            script.FuncBegin("bpFTB").Param(rvPViewUrl).FuncEnd();
            while (reader.Read()) {
              script.FuncBegin("bpFT");
              script.Param((int)reader["PhotoID"]);
              script.ParamEscaped((string)reader["Title"]);
              script.Param((int)reader["RepCnt"]);
              script.Param((int)reader["Hit"]);
              script.Param(((DateTime)reader["CDate"]).ToString("yyyy-MM-dd HH:mm"));
              script.Param((int)reader["SortValue"]);
              script.Param((bool)(reader["Music"].ToString()[0] == 'Y'));
                script.FuncEnd();
            }
            script.Func("bpFTE");
          }
          script.ScriptEnd();
          rvPhotoList = script.ToString();
          
          / *
          reader.NextResult();
          if (CommentRep.Visible = reader.HasRows) {
            CommentRep.DataSource=reader;
            CommentRep.DataBind();
          }
          * /
        } else {
          ViewPanel.Visible=false;
          MsgNotExists.Visible=true;
        }
        reader.Close();
      }
    }

    private void Page_PreRender(object sender, System.EventArgs e) {
      ViewModeRBL.Items.FindByValue(ctx.ViewMode.ToString()).Selected = true;

      if (!IsOwner && ctx.ViewMode == 'N') {
        SqlConnection conn;
        SqlCommand cmd;
        SqlDataReader reader;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          cmd = new SqlCommand("BoxFolderIncHitPhotos",conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = ctx.FolderID;
          cmd.ExecuteNonQuery();
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
      this.ViewModeRBL.SelectedIndexChanged += new System.EventHandler(this.ViewModeRBL_SelectedIndexChanged);
      //this.Submit.Click += new System.EventHandler(this.Submit_Click);
      this.Load += new System.EventHandler(this.Page_Load);
      this.PreRender += new System.EventHandler(this.Page_PreRender);

    }
    #endregion

    / * 
    private void Submit_Click(object sender, System.EventArgs e) {
      this.AssertAuthenticated();
      if (IsValid) {
        SqlConnection conn;
        SqlCommand cmd;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          cmd = new SqlCommand("BoxFCInsert",conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = FolderID;
          cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = UserID;
          cmd.Parameters.Add("@Comment", SqlDbType.NVarChar, 4000).Value = CommentTB.Text.Trim();
          cmd.ExecuteNonQuery();
        }
        ctx.UrlMaker.Redirect("FView.aspx");
      }
    }
    * /

    private void ViewModeRBL_SelectedIndexChanged(object sender, System.EventArgs e) {
      ctx.UrlMaker.AddParam("v", ViewModeRBL.SelectedValue).Redirect("FView.aspx");
    }


procedure BoxFolderSelect
  @FolderID int
  as
  select *, (select count(*) from BoxFoldersPhotos where FolderID = @FolderID) as PhotoCnt  from BoxFolders where FolderID = @FolderID
go

procedure BoxFolderSelectEx
  @FolderID int
  ,@UserID    int
  as
  select * from BoxFolders where FolderID = @FolderID and UserID = @UserID

  if (@@rowcount > 0)
  begin
    declare @SortKey char(1)
    declare @SortDir char(1)
    select @SortKey = SortKey, @SortDir = SortDir from BoxFolders where FolderID = @FolderID and UserID = @UserID

    if (@SortDir = 'A')
      select P.PhotoID, P.CDate, P.Hit, F.SortValue, P.Title, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, RepCnt = (select count(*) from BoxPhotoComments where PhotoID = P.PhotoID)
      from BoxFoldersPhotos F join BoxPhotos P on F.PhotoID = P.PhotoID
      where F.FolderID = @FolderID
      order by SortValue asc
    else 
      select P.PhotoID, P.CDate, P.Hit, F.SortValue,  P.Title, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, RepCnt = (select count(*) from BoxPhotoComments where PhotoID = P.PhotoID)
      from BoxFoldersPhotos F join BoxPhotos P on F.PhotoID = P.PhotoID
      where F.FolderID = @FolderID
      order by SortValue desc

    --*
    select CommentID, UserID, Comment, CDate
    from BoxFolderComments
    where FolderID = @FolderID
    order by CDate
    --*
  end

procedure BoxFolderSelectConcepts
  @UserID int
  as
  select top 50 FolderID, Title
  from BoxFolders
  where UserID = @UserID and Func = 'C'
  order by Title asc
go

procedure BoxFolderSelectListItem
  @FolderID int
  ,@Count   int
  as

  declare @SortDir char(1)

  select @SortDir = SortDir
  from BoxFolders where FolderID = @FolderID

  select Func, Title, Hit, CDate as [Date], RepCnt = (select count(*) from BoxFolderComments where FolderID = @FolderID), 
    PhotoCnt = (select count(*) from BoxFoldersPhotos where FolderID = @FolderID)
  from BoxFolders where FolderID = @FolderID

  if (@SortDir = 'A')
    select top (@Count) F.PhotoID, P.Hit, RepCnt = (select count(*) from BoxPhotoComments where PhotoID = F.PhotoID), P.CDate, P.title
    from BoxFoldersPhotos F join BoxPhotos P on F.PhotoID = P.PhotoID
    where F.FolderID = @FolderID
    order by F.SortValue asc
  else
    select top (@Count) F.PhotoID, P.Hit, RepCnt = (select count(*) from BoxPhotoComments where PhotoID = F.PhotoID), P.CDate, P.title
    from BoxFoldersPhotos F join BoxPhotos P on F.PhotoID = P.PhotoID
    where F.FolderID = @FolderID
    order by F.SortValue desc
go

*/