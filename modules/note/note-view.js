/* TODO

public class TView : WebSite.UserControl {
    private bool showCP = true;
    protected System.Web.UI.HtmlControls.HtmlGenericControl CmdPanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl ReplyDisabledPanel;
    private bool incHit = true;

    public bool IsThreadLocked;
    public bool IsThreadOwner;
    public bool IsSubscribed;
    public bool IsReplayable;

    public string rvThreadViewScript;
    public string rvThreadTitle;
    public string rvReplyLink = String.Empty;
    public string rvUnsubscribeLink = String.Empty;
    public string rvSubscribeLink = String.Empty;

    public bool ShowCP {
      set {
        showCP = value;
      }
    }

    public bool IncHit {
      set {
        incHit = value;
      }
    }

    private void Page_PreRender(object sender, System.EventArgs e) {
      Page.SetNoteContext();

      NoteContext nc = Page.NoteContext;

      if (Page.NoteContext.ThreadID > 0) {
        SqlConnection conn;
        SqlCommand cmd;
        SqlDataReader reader;

        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          nc.ReadFolder(conn);
          nc.SetRefPhotoScript(conn);

          ScriptBuilder script = new ScriptBuilder(16384);

          cmd = new SqlCommand("BBSSelectThreadArticles", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@ThreadID", SqlDbType.Int).Value = nc.ThreadID;
          if (Page.User.IsAuthenticated) {
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = Page.UserID;
          }

          reader = cmd.ExecuteReader();
          if (!reader.Read()) {
            Page.ShowInvalidPage();
          }
          nc.CheckPermForHidden(reader["Hidden"].ToString()[0] == 'Y', (int)reader["UserID"]);
          rvThreadTitle = HttpUtility.HtmlEncode(reader["Title"].ToString());
          IsThreadLocked = reader["Lock"].ToString()[0] == 'Y';
          IsThreadOwner = (int)reader["UserID"] == Page.UserID;
          IsSubscribed = reader["Subsc"].ToString()[0] == 'Y';
          if (IsSubscribed) {
            rvUnsubscribeLink = nc.UrlMaker.Clone().AddParam("t", Page.NoteContext.ThreadID).AddParam("cmd","n").GetUrl("TSubscribe.aspx");
          } else {
            rvSubscribeLink = nc.UrlMaker.Clone().AddParam("t", Page.NoteContext.ThreadID).AddParam("cmd","y").GetUrl("TSubscribe.aspx");
          }
  
          reader.NextResult();
          script.ScriptBegin();
          script.FuncBegin("bbsTB").Param(showCP).Param(nc.UrlMaker.Clone().AddParam("t",nc.ThreadID).GetUrl("TEdit.aspx")).Param(nc.Folder.OwnerType).Param(nc.Folder.OwnerID).FuncEnd();
          while(reader.Read()) {
            int articleID = (int)reader["ArticleID"];
            int articleUserID = (int)reader["UserID"];
            
            script.FuncBegin("bbsAB");
            script.Param(articleID);
            script.Param(articleUserID);
            script.ParamEscaped((string)reader["Text"]);
            script.FuncEnd();
  
            foreach(string file in new BDSManager(articleUserID, null, "BBS", articleID).GetFileNames(true)) {
              script.FuncBegin("bbsAA").ParamEscaped(file).FuncEnd();
            }
                        
            script.FuncBegin("bbsAE");
            script.Param(WebSite.UserManager.GetUser((int)reader["UserID"]).Name);
            script.Param(WebSite.UserManager.GetUser((int)reader["UserID"]).FIcon);
            script.Param(((DateTime)reader["CDate"]).ToString("yyyy-MM-dd HH:mm"));
            script.ParamEscaped((string)reader["Music"]);
            script.FuncEnd();
          }
          script.Func("bbsTE");
          script.ScriptEnd();
          reader.Close();

          rvThreadViewScript = script.ToString();
          
          if (incHit && !IsThreadOwner) {
            cmd = new SqlCommand("BBSIncHit", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@ThreadID", SqlDbType.Int).Value = Page.NoteContext.ThreadID;
            cmd.ExecuteNonQuery();
          }
        }
        if (showCP) {
          CmdPanel.Visible = true;
          ReplyDisabledPanel.Visible = IsThreadLocked;
          IsReplayable = !IsThreadLocked && (!Page.NoteContext.Folder.DisableGuestReply || Page.NoteContext.IsFolderAdmin);
          if (IsReplayable) {
            rvReplyLink = nc.UrlMaker.Clone().AddParam("t", Page.NoteContext.ThreadID).GetUrl("TReply.aspx");
          }
        } else {
          CmdPanel.Visible = false;
        }
      } else {
        this.Visible = false;
      }
    }


procedure BBSSelectArticle
  @ArticleID  int
  as

  select *
  from BBSArticles
  where ArticleID = @ArticleID

  select T.*
  from BBSArticles A join BBSThreads T on A.ThreadID = T.ThreadID
  where ArticleID = @ArticleID

procedure BBSSelectThreadArticles
  @UserID  int = null
  ,@ThreadID  int
  as

  if (@UserID is null)
    select *, 'N' as Subsc 
    from BBSThreads
    where ThreadID = @ThreadID
  else
    select 
      *, 
      case when exists (select * from BBSUsersThreads where UserID = @UserID and ThreadID = @ThreadID) then 'Y' else 'N' end as Subsc
    from BBSThreads
    where ThreadID = @ThreadID
  

  select ArticleID, UserID, [Text], Music, CDate
  from BBSArticles  
  where ThreadID = @ThreadID
  order by CDate
go
*/