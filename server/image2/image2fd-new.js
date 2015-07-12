/* TODO

<%@ Page language="c#" AutoEventWireup="false" Inherits="WebSite.Com.BoxPhoto.FNew" CodeBehind="FNew.aspx.cs" %>
<%@ Register TagPrefix="bah" NameSpace="Bah.Web.Controls" Assembly="Bah"%>

<HTML>
<head>
<%=LPContext.ClientInitScript%>
</head>

<body>
<form runat="server" ID="Form">
<script>lpRenderBegin()</script>
<div class=fm>
<script>lpRenderTitle("폴더 추가")</script>

<asp:ValidationSummary Runat="server" ID="VdSummary" DisplayMode="List" ShowSummary="true" ShowMessageBox="false" CssClass="vdsummary"/>

<div class=fm-bbs>

<div class=form>
폴더이름
<asp:RequiredFieldValidator Runat="server" ID="TitleTBVd" ControlToValidate="TitleTB" Text="*" ErrorMessage="폴더이름을 입력해 주십시오." Display="Dynamic"/>
<br>
<asp:TextBox Runat="server" ID="TitleTB" CssClass="tb-full" MaxLength="128" TextMode=MultiLine Rows=4></asp:TextBox>
</div>

<div class=form>
폴더내용
<br>
<asp:TextBox Runat="server" ID="CommentTB" TextMode="MultiLine" Rows="15"></asp:TextBox><br>
<div class=desc>사진들에 대한 개략적 설명. HTML 태그는 사용하실 수 없습니다.</div>
</div>

<div class=form>
촬영노트
<br>
<asp:TextBox Runat="server" ID="NoteTB" TextMode="MultiLine" Rows="5"></asp:TextBox><br>
<div class=desc>폴더에 포함된 사진들에 표시할 촬영정보. HTML 태그는 사용하실 수 없습니다.</div>
</div>

<div class=form>
배경음악 링크<br>
<asp:TextBox Runat="server" ID="MusicTB" CssClass="tb-full" MaxLength="1024"></asp:TextBox><br>
<div class=desc>예: http://www.musicsite.com/dir/music.asf</div>
</div>

<%--
<div class=form>
사진 정렬 기준<br>
<asp:RadioButtonList Runat=server ID="SortKeyRBL" RepeatDirection=Horizontal RepeatLayout=Flow>
<asp:ListItem Value="C" Selected>등록일순</asp:ListItem>
<asp:ListItem Value="V">정렬값순</asp:ListItem>
</asp:RadioButtonList>
</div>
--%>

<div class=form>
사진 정렬 방향<br>
<asp:RadioButtonList Runat=server ID="SortDirRBL" RepeatDirection=Horizontal RepeatLayout=Flow>
<asp:ListItem Value="A" Selected>오름차순</asp:ListItem>
<asp:ListItem Value="D">내림차순</asp:ListItem>
</asp:RadioButtonList>
</div>

<div class=form-submit>
<asp:Button Runat="server" ID="Submit" Text="폴더 등록" CssClass="btn"></asp:Button>
</div>

</div>


</div>
<script>lpRenderEnd()</script>
</form>
</body>
</html>


protected System.Web.UI.WebControls.ValidationSummary VdSummary;
    protected System.Web.UI.WebControls.RequiredFieldValidator TitleTBVd;
    protected System.Web.UI.WebControls.TextBox TitleTB;
    protected System.Web.UI.WebControls.TextBox CommentTB;
    protected System.Web.UI.WebControls.TextBox NoteTB;
    protected System.Web.UI.WebControls.TextBox MusicTB;
    protected System.Web.UI.WebControls.RadioButtonList SortKeyRBL;
    protected System.Web.UI.WebControls.RadioButtonList SortDirRBL;
    protected System.Web.UI.WebControls.Button Submit;

    private BoxPhotoContext ctx;

    private void Page_Load(object sender, System.EventArgs e) {
      AssertBoxAdmin();
      SetBoxPhotoContext();
      ctx = BoxPhotoContext;
    }

    private void Submit_Click(object sender, System.EventArgs e) {
      if (IsValid) {
        SqlConnection conn;
        SqlCommand cmd;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          cmd = new SqlCommand("BoxFolderInsert", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = OwnerID;
          cmd.Parameters.Add("@SortKey", SqlDbType.Char, 1).Value = 'V'; //SortKeyRBL.SelectedValue[0];
          cmd.Parameters.Add("@SortDir", SqlDbType.Char, 1).Value = SortDirRBL.SelectedValue[0];
          cmd.Parameters.Add("@Func", SqlDbType.Char, 1).Value = ctx.Function;
          cmd.Parameters.Add("@FHidden", SqlDbType.Char, 1).Value = 'N';
          cmd.Parameters.Add("@SortValue", SqlDbType.Int).Value = 0;
          cmd.Parameters.Add("@Title", SqlDbType.NVarChar, 128).Value = TitleTB.Text.Trim();
          cmd.Parameters.Add("@Music", SqlDbType.VarChar, 1024).Value = MusicTB.Text.Trim();
          cmd.Parameters.Add("@Comment", SqlDbType.NText).Value = CommentTB.Text.Trim();
          cmd.Parameters.Add("@Note", SqlDbType.NText).Value = NoteTB.Text.Trim();
          cmd.ExecuteNonQuery();
        }
        ctx.UrlMaker.AddParam("pg", null).Redirect("FList.aspx");
      }
    }
  }

procedure BoxFolderInsert
  @UserID   int
  ,@SortKey char(1)
  ,@SortDir char(1)
  ,@Func    char(1)
  ,@FHidden char(1)
  ,@SortValue int
  ,@ThumbCount  int = 15
  ,@Title   nvarchar(128)
  ,@Music   varchar(1024)
  ,@Comment ntext
  ,@Note  ntext
  as

  declare @FolderID int

  exec SeqNextValue 'boxfolder', @FolderID output

  insert BoxFolders(FolderID, UserID, SortKey, SortDir, Func, FHidden, Title, Music, Comment, Note, SortValue, ThumbCount)
  select @FolderID, @UserID, @SortKey, @SortDir, @Func, @FHidden, @Title, @Music, @Comment, @Note, case when @SortValue = 0 then isnull(max(SortValue),0) + 10 else @SortValue end, @ThumbCount
    from BoxFolders where UserID = @UserID and Func = @Func
go

*/